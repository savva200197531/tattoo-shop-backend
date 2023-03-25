import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Color } from '@/api/products-filters/entities/color.entity';
import {
  CreateColorDto,
  UpdateColorDto,
} from '@/api/products-filters/dto/color.dto';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color)
    private readonly repository: Repository<Color>,
  ) {}

  findAll(): Promise<Color[]> {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findAllWithFilters(category_id: number): Promise<Color[]> {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
      where: {
        category_ids: ArrayContains([category_id]),
      },
    });
  }

  findOne(id: number): Promise<Color> {
    return this.repository.findOneBy({ id });
  }

  async create(params: CreateColorDto): Promise<Color> {
    const newColor = this.repository.create(params);

    return this.repository.save(newColor);
  }

  async update(id: number, params: UpdateColorDto): Promise<UpdateResult> {
    return this.repository.update({ id }, params);
  }

  public async remove(id: number): Promise<DeleteResult> {
    return this.repository.delete({ id });
  }
}
