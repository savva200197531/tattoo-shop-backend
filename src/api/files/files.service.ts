import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import LocalFile from '@/api/files/entities/local-file.entity';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
  ) {}

  async findOne(id: number): Promise<LocalFile> {
    const img = await this.localFileRepository.findOneBy({ id });
    if (!img) {
      throw new NotFoundException();
    }
    return img;
  }

  async create(fileData: LocalFileDto) {
    const newFile = await this.localFileRepository.create(fileData);

    return this.localFileRepository.save(newFile);
  }

  async remove(id: number) {
    const file = await this.findOne(id);

    await fs.unlink(join(process.cwd(), file.path), (err) => {
      if (err) {
        console.error(err);
        return err;
      }
    });

    return this.localFileRepository.delete({ id });
  }
}
