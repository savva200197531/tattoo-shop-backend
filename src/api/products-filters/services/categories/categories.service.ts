import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Category } from '@/api/products-filters/entities/category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/api/products-filters/dto/category.dto';
import { DeleteResult } from 'typeorm/browser';
import { FilesService } from '@/api/files/files.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
    @Inject(FilesService)
    private readonly filesService: FilesService,
  ) {}

  findAll(): Promise<Category[]> {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findOne(id: number): Promise<Category> {
    return this.repository.findOneBy({ id });
  }

  async create(params: CreateCategoryDto): Promise<Category> {
    const img = await this.filesService.findOne(params.img_id);

    if (!img) {
      throw new HttpException('No img found', HttpStatus.NOT_FOUND);
    }

    await this.filesService.update(params.img_id, { is_used: true });

    const newCategory = this.repository.create(params);

    return this.repository.save(newCategory);
  }

  async update(id: number, params: UpdateCategoryDto): Promise<UpdateResult> {
    const category = await this.findOne(id);

    await this.filesService.update(category.img_id, { is_used: false });

    await this.filesService.update(params.img_id, { is_used: true });

    return this.repository.update({ id }, params);
  }

  public async remove(id: number): Promise<DeleteResult> {
    const category = await this.findOne(id);

    if (category.img_id) {
      await this.filesService.remove(category.img_id);
    }

    return this.repository.delete({ id });
  }
}
