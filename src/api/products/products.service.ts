import { Repository, UpdateResult } from 'typeorm';

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@/api/products/entities/product.entity';
import { GetProductsFilterDto } from '@/api/products/dto/products.dto';
import { CreateProduct, UpdateProduct } from '@/api/products/types/product';
import { FilesService } from '@/api/files/files.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
  ) {}

  public async create({ images, ...rest }: CreateProduct): Promise<Product> {
    const newProduct = this.repository.create(rest);

    const savedProduct = await this.repository.save(newProduct);

    if (images.length) {
      await Promise.all(
        images.map((img) =>
          this.filesService.saveLocalProductImgData(img, savedProduct.id),
        ),
      );
    }

    return savedProduct;
  }

  public findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  public findProductsWithFilters(filterDto: GetProductsFilterDto) {}

  public findProduct(id: number): Promise<Product> {
    return this.repository.findOneBy({ id });
  }

  public update(
    id: number,
    updateProductDto: UpdateProduct,
  ): Promise<UpdateResult> {
    return this.repository.update({ id }, { ...updateProductDto });
  }

  public async remove(id: number) {
    const product = await this.findProduct(id);

    if (product.img_ids) {
      await Promise.all(
        product.img_ids.map((id) =>
          this.filesService.removeLocalProductImg(id),
        ),
      );
    }

    return this.repository.delete({ id });
  }
}
