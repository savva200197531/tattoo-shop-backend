import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Product } from "@/api/products/entities/product.entity";
import { UpdateProductDto } from "@/api/products/dto/update-product.dto";
import { CreateProductDto } from "@/api/products/dto/create-product.dto";

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

  findOne(id: number): Promise<Product> {
    return this.repository.findOneBy({ id });
  }

  update(id: number, updateProductDto: UpdateProductDto): Promise<UpdateResult> {
    return this.repository.update({ id }, { ...updateProductDto });
  }

  remove(id: number) {
    return this.repository.delete({ id });
  }
}
