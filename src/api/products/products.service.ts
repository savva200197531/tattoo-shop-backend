import { Repository, UpdateResult } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@/api/products/entities/product.entity';
import { GetProductsFilterDto } from '@/api/products/dto/products.dto';
import { CreateProduct, UpdateProduct } from '@/api/products/types/product';
import { FilesService } from '@/api/files/files.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
    @Inject(FilesService)
    private readonly filesService: FilesService,
  ) {}

  public async create({ images, ...params }: CreateProduct): Promise<Product> {
    const newProduct = this.repository.create(params);

    const savedProduct = await this.repository.save(newProduct);

    const savedImages = await Promise.all(
      images.map((img) => this.filesService.create(img)),
    );

    // if (product.img_ids) {
    //   imgIds.push(...product.img_ids);
    // }
    // imgIds.push(savedImg.id);

    await this.update(savedProduct.id, {
      img_ids: savedImages.map((img) => img.id),
    });

    return savedProduct;
  }

  public findAll(): Promise<Product[]> {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  public findProductsWithFilters(filterDto: GetProductsFilterDto) {}

  public findOne(id: number): Promise<Product> {
    return this.repository.findOneBy({ id });
  }

  public update(id: number, params: UpdateProduct): Promise<UpdateResult> {
    return this.repository.update({ id }, { ...params });
  }

  public async remove(id: number) {
    const product = await this.findOne(id);

    if (product.img_ids) {
      await Promise.all(
        product.img_ids.map((id) => this.filesService.remove(id)),
      );
    }

    return this.repository.delete({ id });
  }
}
