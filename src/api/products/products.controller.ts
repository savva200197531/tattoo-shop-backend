import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateProductDto,
  UpdateProductDto,
} from '@/api/products/dto/products.dto';
import { Product } from '@/api/products/entities/product.entity';
import RoleGuard from '@/api/user/role.guard';
import Role from '@/api/user/role.enum';
import { ExpressMulterFile } from '@/api/types/file';
import LocalFilesInterceptor from '@/api/files/interceptors/local-files.interceptor';
import { FilesService } from '@/api/files/files.service';
import LocalFile from '@/api/files/entities/local-file.entity';

import { ProductsService } from './products.service';

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
    return Promise.all(images.map((img) => this.filesService.create(img)));
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Product>> {
    return this.productsService.findAllWithPaginationAndFilters(query);
  }

  @Get(':id')
  findProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
