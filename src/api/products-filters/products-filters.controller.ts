import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsFiltersService } from './products-filters.service';
import RoleGuard from '@/api/user/role.guard';
import Role from '@/api/user/role.enum';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/api/products-filters/dto/category.dto';
import { Category } from '@/api/products-filters/entities/category.entity';
import { UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';

@Controller('products-filters')
export class ProductsFiltersController {
  constructor(
    private readonly productsFiltersService: ProductsFiltersService,
  ) {}

  @Get('category')
  findAll(): Promise<Category[]> {
    return this.productsFiltersService.findAll();
  }

  @Post('category')
  @UseGuards(RoleGuard(Role.Admin))
  createCategory(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.productsFiltersService.createCategory(body);
  }

  @Patch('category/:id')
  @UseGuards(RoleGuard(Role.Admin))
  private updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return this.productsFiltersService.updateCategory(id, body);
  }

  @Delete('category/:id')
  @UseGuards(RoleGuard(Role.Admin))
  private remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.productsFiltersService.remove(id);
  }
}
