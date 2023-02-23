import { Module } from '@nestjs/common';
import { ProductsFiltersService } from './products-filters.service';
import { ProductsFiltersController } from './products-filters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/api/products-filters/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [ProductsFiltersController],
  providers: [ProductsFiltersService],
})
export class ProductsFiltersModule {}
