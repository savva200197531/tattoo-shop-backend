import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CreateProductDto, GetProductsFilterDto, UpdateProductDto } from "@/api/products/dto/products.dto";

import { ProductsService } from "./products.service";
import { Product } from "@/api/products/entities/product.entity";
import RoleGuard from "@/api/user/role.guard";
import Role from "@/api/user/role.enum";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get()
  findAll(
    @Query() query: GetProductsFilterDto,
  ): Promise<Product[]> {
    if (Object.keys(query).length) {
      // return this.productsService.findProductsWithFilters(filterDto)
    }

    return this.productsService.findAll();
  }

  @Get(':id')
  findProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findProduct(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto)
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id)
  }
}
