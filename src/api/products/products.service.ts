import { Repository, UpdateResult } from "typeorm";

import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "@/api/products/entities/product.entity";
import { CreateProductDto, UpdateProductDto } from "@/api/products/dto/products.dto";

@Injectable()
export class ProductsService {
  @InjectRepository(Product)
  private readonly repository: Repository<Product>;

  create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.repository.create(createProductDto);

    return this.repository.save(newProduct)
  }

  findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  findProduct(id: number): Promise<Product> {
    return this.repository.findOneBy({ id });
  }

  update(id: number, updateProductDto: UpdateProductDto): Promise<UpdateResult> {
    return this.repository.update({ id }, { ...updateProductDto });
  }

  remove(id: number) {
    return this.repository.delete({ id });
  }
}
