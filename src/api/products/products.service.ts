import { Repository, UpdateResult } from "typeorm";

import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "@/api/products/entities/product.entity";
import { GetProductsFilterDto } from "@/api/products/dto/products.dto";
import { CreateProduct, UpdateProduct } from "@/api/products/types/product";
import { FilesService } from "@/api/files/files.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
    @Inject(forwardRef(() => FilesService)) private readonly filesService: FilesService
  ) {}


  public async create({ images, ...rest }: CreateProduct): Promise<Product> {
    const newProduct = this.repository.create(rest);

    const savedProduct = await this.repository.save(newProduct)

    if (images.length) {
      images.forEach(img => this.filesService.uploadProductImg(img, savedProduct.id))
    }

    return savedProduct
  }

  public findAll(): Promise<Product[]> {
    return this.repository.find({ relations: ['images'] })
  }

  public findProductsWithFilters(filterDto: GetProductsFilterDto) {}

  public findProduct(id: number): Promise<Product> {
    return this.repository.findOneBy({ id });
  }

  public update(id: number, updateProductDto: UpdateProduct): Promise<UpdateResult> {
    return this.repository.update({ id }, { ...updateProductDto });
  }

  public remove(id: number) {
    return this.repository.delete({ id });
  }
}
