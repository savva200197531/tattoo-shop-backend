import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/api/products-filters/entities/category.entity';
import { FilesModule } from '@/api/files/files.module';
import { BrandsController } from '@/api/products-filters/controllers/brands/brands.controller';
import { CategoriesController } from '@/api/products-filters/controllers/categories/categories.controller';
import { CategoriesService } from '@/api/products-filters/services/categories/categories.service';
import { Brand } from '@/api/products-filters/entities/brand.entity';
import { BrandsService } from '@/api/products-filters/services/brands/brands.service';
import { Color } from '@/api/products-filters/entities/color.entity';
import { Amount } from '@/api/products-filters/entities/amount.entity';
import { ColorsController } from '@/api/products-filters/controllers/colors/colors.controller';
import { AmountController } from '@/api/products-filters/controllers/amount/amount.controller';
import { ColorsService } from '@/api/products-filters/services/colors/colors.service';
import { AmountService } from '@/api/products-filters/services/amount/amount.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Brand, Color, Amount]),
    FilesModule,
  ],
  controllers: [
    CategoriesController,
    BrandsController,
    ColorsController,
    AmountController,
  ],
  providers: [CategoriesService, BrandsService, ColorsService, AmountService],
  exports: [CategoriesService, BrandsService, ColorsService, AmountService],
})
export class ProductsFiltersModule {}
