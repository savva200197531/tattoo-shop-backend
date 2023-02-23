import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/api/products-filters/entities/category.entity';
import { FilesModule } from '@/api/files/files.module';
import { CategoriesController } from '@/api/products-filters/controllers/categories.controller';
import { CategoriesService } from '@/api/products-filters/services/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), FilesModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class ProductsFiltersModule {}
