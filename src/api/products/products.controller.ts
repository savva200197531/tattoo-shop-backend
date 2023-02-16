import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateProductDto,
  GetProductsFilterDto,
  UpdateProductDto,
} from '@/api/products/dto/products.dto';
import { Product } from '@/api/products/entities/product.entity';
import RoleGuard from '@/api/user/role.guard';
import Role from '@/api/user/role.enum';
import { ExpressMulterFile } from '@/api/types/file';

import { ProductsService } from './products.service';
import LocalFilesInterceptor from '@/api/files/interceptors/local-files.interceptor';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'images',
      maxCount: 9,
      path: '/products-images',
    }),
  )
  create(
    @Body() { count, price, ...rest }: CreateProductDto,
    @UploadedFiles() images: ExpressMulterFile[],
  ) {
    return this.productsService.create({
      count: +count,
      price: +price,
      images,
      ...rest,
    });
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() query: GetProductsFilterDto): Promise<Product[]> {
    if (Object.keys(query).length) {
      // return this.productsService.findProductsWithFilters(filterDto)
    }

    return this.productsService.findAll();
  }

  @Get(':id')
  findProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private update(
    @Param('id', ParseIntPipe) id: number,
    @Body() { count, price, ...rest }: UpdateProductDto,
  ) {
    return this.productsService.update(id, {
      count: +count,
      price: +price,
      ...rest,
    });
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
