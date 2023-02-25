import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Brand } from '@/api/products-filters/entities/brand.entity';
import {
  CreateBrandDto,
  UpdateBrandDto,
} from '@/api/products-filters/dto/brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly repository: Repository<Brand>,
  ) {}

  findAll(): Promise<Brand[]> {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findAllWithFilters(category_id: number): Promise<Brand[]> {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
      where: {
        category_ids: ArrayContains([category_id]),
      },
    });
  }

  findOne(id: number): Promise<Brand> {
    return this.repository.findOneBy({ id });
  }

  async create(params: CreateBrandDto): Promise<Brand> {
    const newBrand = this.repository.create(params);

    return this.repository.save(newBrand);
  }

  async update(id: number, params: UpdateBrandDto): Promise<UpdateResult> {
    return this.repository.update({ id }, params);
  }

  public async remove(id: number): Promise<DeleteResult> {
    return this.repository.delete({ id });
  }
}
