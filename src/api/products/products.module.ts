import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/api/products/entities/product.entity';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { FilesModule } from '@/api/files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FilesModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
