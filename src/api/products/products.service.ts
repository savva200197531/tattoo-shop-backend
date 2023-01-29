import { Repository, UpdateResult } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "@/api/products/entities/product.entity";
import { CreateProductDto, GetProductsFilterDto, UpdateProductDto } from "@/api/products/dto/products.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
  ) {}


  public create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.repository.create(createProductDto);

    return this.repository.save(newProduct)
  }

  public findAll(): Promise<Product[]> {
    return this.repository.find()
  }

  public findProductsWithFilters(filterDto: GetProductsFilterDto) {}

  public findProduct(id: number): Promise<Product> {
    return this.repository.findOneBy({ id });
  }

  public update(id: number, updateProductDto: UpdateProductDto): Promise<UpdateResult> {
    return this.repository.update({ id }, { ...updateProductDto });
  }

  public remove(id: number) {
    return this.repository.delete({ id });
  }
}
