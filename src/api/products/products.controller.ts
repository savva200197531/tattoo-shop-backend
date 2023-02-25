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
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateProductDto,
  GetPriceRangeFilterDto,
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

  @Get('price-range')
  findPriceRange(@Query() query: GetPriceRangeFilterDto) {
    return this.productsService.findPriceRange(query);
  }

  @Get('search')
  @UseInterceptors(ClassSerializerInterceptor)
  findAllWithSearch(@Query('search') search: string): Promise<Product[]> {
    if (search.length) {
      return this.productsService.findAllWithSearch(search);
    }
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Product>> {
    if (query.filter) {
      return this.productsService.findAllWithPaginationAndFilters(query);
    }
    return this.productsService.findAllWithPagination(query);
  }

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
