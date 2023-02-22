import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
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
import LocalFilesInterceptor from '@/api/files/interceptors/local-files.interceptor';

import { ProductsService } from './products.service';
import { FilesService } from '@/api/files/files.service';
import LocalFile from '@/api/files/entities/local-file.entity';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @Inject(FilesService)
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'images',
      maxCount: 9,
      path: '/products-images',
    }),
  )
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Post('upload-images')
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'images',
      maxCount: 9,
      path: '/products-images',
    }),
  )
  private async createSlideImg(
    @UploadedFiles() images: ExpressMulterFile[],
  ): Promise<LocalFile[]> {
    console.log(images);
    return Promise.all(images.map((img) => this.filesService.create(img)));
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() query: GetProductsFilterDto): Promise<Product[]> {
    if (Object.keys(query).length) {
      // return this.productsService.findProductsWithFilters(query);
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
