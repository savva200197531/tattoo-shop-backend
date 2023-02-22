import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import LocalFile from '@/api/files/entities/local-file.entity';
import * as fs from 'fs';
import { join } from 'path';
import { DeleteResult } from 'typeorm/browser';
import {
  CreateLocalFileDto,
  UpdateLocalFileDto,
} from '@/api/files/dto/local-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly repository: Repository<LocalFile>,
  ) {}

  async findOne(id: number): Promise<LocalFile> {
    const img = await this.repository.findOneBy({ id });

    if (!img) {
      throw new NotFoundException();
    }
    return img;
  }

  async create(fileData: CreateLocalFileDto): Promise<LocalFile> {
    const newFile = await this.repository.create(fileData);

    return this.repository.save(newFile);
  }

  update(id: number, params: UpdateLocalFileDto): Promise<UpdateResult> {
    return this.repository.update({ id }, { ...params });
  }

  async remove(id: number): Promise<DeleteResult> {
    const file = await this.findOne(id);

    await fs.unlink(join(process.cwd(), file.path), (err) => {
      if (err) {
        console.error(err);
        return err;
      }
    });

    return this.repository.delete({ id });
  }
}
