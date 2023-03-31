import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import RoleGuard from '@/api/user/role.guard';
import Role from '@/api/user/role.enum';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/api/products-filters/dto/category.dto';
import { Category } from '@/api/products-filters/entities/category.entity';
import { DeleteResult } from 'typeorm/browser';
import LocalFileInterceptor from '@/api/files/interceptors/local-file.interceptor';
import { ExpressMulterFile } from '@/api/types/file';
import LocalFile from '@/api/files/entities/local-file.entity';
import { FilesService } from '@/api/files/files.service';
import { CategoriesService } from '@/api/products-filters/services/categories/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  create(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(body);
  }

  @Post('upload-img')
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(
    LocalFileInterceptor({
      fieldName: 'img',
      path: '/categories-images',
    }),
  )
  private createImg(
    @UploadedFile() img: ExpressMulterFile,
  ): Promise<LocalFile> {
    return this.filesService.create(img);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.categoriesService.remove(id);
  }
}
