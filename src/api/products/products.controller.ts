import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ProductsService } from './products.service';
import { UpdateProductDto } from "@/api/products/dto/update-product.dto";
import { CreateProductDto } from "@/api/products/dto/create-product.dto";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  private update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto)
  }

  @Delete(':id')
  private remove(@Param('id', ParseIntPipe) id: number) {
    this.productsService.remove(id)
  }
}
