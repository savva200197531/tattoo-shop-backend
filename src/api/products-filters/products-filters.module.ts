import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/api/products-filters/entities/category.entity';
import { FilesModule } from '@/api/files/files.module';
import { BrandsController } from '@/api/products-filters/controllers/brands/brands.controller';
import { CategoriesController } from '@/api/products-filters/controllers/categories/categories.controller';
import { CategoriesService } from '@/api/products-filters/services/categories/categories.service';
import { Brand } from '@/api/products-filters/entities/brand.entity';
import { BrandsService } from '@/api/products-filters/services/brands/brands.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Brand]), FilesModule],
  controllers: [CategoriesController, BrandsController],
  providers: [CategoriesService, BrandsService],
  exports: [CategoriesService, BrandsService],
})
export class ProductsFiltersModule {}
