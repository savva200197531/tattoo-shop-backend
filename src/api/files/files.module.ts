import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '@/api/products/products.module';
import { LocalProductImg } from '@/api/files/entities/local-product-img.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocalProductImg]),
    forwardRef(() => ProductsModule),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
