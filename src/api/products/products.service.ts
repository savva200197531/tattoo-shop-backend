import { Repository, UpdateResult } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@/api/products/entities/product.entity';
import {
  CreateProductDto,
  GetProductsFilterDto,
  UpdateProductDto,
} from '@/api/products/dto/products.dto';
import { FilesService } from '@/api/files/files.service';
import { from } from 'rxjs';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
    @Inject(FilesService)
    private readonly filesService: FilesService,
  ) {}

  public async create(params: CreateProductDto): Promise<Product> {
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

    const newProduct = this.repository.create(params);

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

  public findProductsWithFilters(
    params: GetProductsFilterDto & PaginateQuery,
  ): Promise<Product[]> {
    // return from(this.repository.findAndCount({
    //   skip: params.page * params.limit || 0
    //   take: params.limit || 10
    //   order: { id: "ASC" },
    //   select: []
    // }));
    return;
  }

  public findOne(id: number): Promise<Product> {
    return this.repository.findOneBy({ id });
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
