import { Repository, UpdateResult } from 'typeorm';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { DeleteResult } from 'typeorm/browser';

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@/api/products/entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
} from '@/api/products/dto/products.dto';
import { FilesService } from '@/api/files/files.service';
import { CategoriesService } from '@/api/products-filters/services/categories/categories.service';
import { BrandsService } from '@/api/products-filters/services/brands/brands.service';
import { paginateConfig } from '@/api/products/paginate-config';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
    @Inject(FilesService)
    private readonly filesService: FilesService,
    @Inject(FilesService)
    private readonly categoriesService: CategoriesService,
    @Inject(BrandsService)
    private readonly brandsService: BrandsService,
  ) {}

  async findAllWithPaginationAndFilters(query: PaginateQuery): Promise<any> {
    return paginate(query, this.repository, {
      ...paginateConfig,
      where: query.filter,
      defaultSortBy: query.sortBy as any,
    });
  }

  public async create(params: CreateProductDto): Promise<Product> {
    const category = this.categoriesService.findOne(params.category_id);
    const brand = this.brandsService.findOne(params.brand_id);

    if (!category) {
      throw new HttpException('Unknown category', HttpStatus.NOT_FOUND);
    }

    if (!brand) {
      throw new HttpException('Unknown brand', HttpStatus.NOT_FOUND);
    }

    const images = await Promise.all(
      params.img_ids.map((img_id) => this.filesService.findOne(img_id)),
    );

    if (images.length) {
      await Promise.all(
        images.map((img) =>
          this.filesService.update(img.id, { is_used: true }),
        ),
      );
    }

    const newProduct = this.repository.create({
      ...params,
      created_at: new Date(),
    });

    return this.repository.save(newProduct);
  }

  public async update(
    id: number,
    params: UpdateProductDto,
  ): Promise<UpdateResult> {
    const product = await this.findOne(id);

    await Promise.all(
      product.img_ids.map((img_id) =>
        this.filesService.update(img_id, { is_used: false }),
      ),
    );

    await Promise.all(
      params.img_ids.map((img_id) =>
        this.filesService.update(img_id, { is_used: true }),
      ),
    );

    return this.repository.update({ id }, params);
  }

  public findAll(): Promise<Product[]> {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  // public findProductsWithPagination(
  //   options: IPaginationOptions,
  // ): Promise<Pagination<Product>> {
  //   return paginate<Product>(this.repository, options);
  // }

  public findOne(id: number): Promise<Product> {
    return this.repository.findOneBy({ id });
  }

  // public findPriceRange(): Promise<{ max: number, min: number }> {
  //   return this.repository.find( });
  // }

  public async remove(id: number): Promise<DeleteResult> {
    const product = await this.findOne(id);

    if (product.img_ids) {
      await Promise.all(
        product.img_ids.map((id) => this.filesService.remove(id)),
      );
    }

    return this.repository.delete({ id });
  }
}
