import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Category } from '@/api/products-filters/entities/category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/api/products-filters/dto/category.dto';
import { DeleteResult } from 'typeorm/browser';
@Injectable()
export class ProductsFiltersService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  createCategory(params: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create(params);

    return this.categoryRepository.save(newCategory);
  }

  updateCategory(id: number, params: UpdateCategoryDto): Promise<UpdateResult> {
    return this.categoryRepository.update({ id }, params);
  }

  public async remove(id: number): Promise<DeleteResult> {
    return this.categoryRepository.delete({ id });
  }
}
