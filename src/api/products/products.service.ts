import {
  Between,
  FindOptionsWhere,
  ILike,
  Repository,
  UpdateResult,
} from 'typeorm';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { DeleteResult } from 'typeorm/browser';

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@/api/products/entities/product.entity';
import {
  CreateProductDto,
  GetPriceRangeFilterDto,
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
    const filter: FindOptionsWhere<Product> = {};

    if (query.filter.category_id) {
      filter.category_id = +query.filter.category_id;
    }

    if (query.filter.brand_id) {
      filter.brand_id = +query.filter.brand_id;
    }

    if (query.filter.price_max && query.filter.price_min) {
      filter.price = Between(+query.filter.price_min, +query.filter.price_max);
    }

    console.log(filter);

    return paginate(query, this.repository, {
      ...paginateConfig,
      defaultSortBy: query.sortBy as any,
      where: filter,
    });
  }

  async findAllWithPagination(query: PaginateQuery): Promise<any> {
    return paginate(query, this.repository, {
      ...paginateConfig,
    });
  }

  public findAll(): Promise<Product[]> {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
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

  public findOne(id: number): Promise<Product> {
    return this.repository.findOneBy({ id });
  }

  public async findPriceRange(
    query: GetPriceRangeFilterDto,
  ): Promise<{ max: number; min: number }> {
    const filter: FindOptionsWhere<Product> = {};

    if (query.category_id) {
      filter.category_id = +query.category_id;
    }

    const products = await this.repository.find({ where: filter });

    const prices = products.map((product) => product.price);

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  findAllWithSearch(search: string): Promise<Product[]> {
    return this.repository.find({
      where: { name: ILike(`%${search}%`) },
    });
  }

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
