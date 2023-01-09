import { Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  private create() {
    return this.productsService.create()
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  private update(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.update(id)
  }

  @Delete(':id')
  private remove(@Param('id', ParseIntPipe) id: number) {
    this.productsService.remove(id)
  }
}
