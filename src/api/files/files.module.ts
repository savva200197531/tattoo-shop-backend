import { forwardRef, Module } from "@nestjs/common";
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductImg } from "@/api/files/entities/product-img.entity";
import { ProductsModule } from "@/api/products/products.module";

@Module({
  imports: [TypeOrmModule.forFeature([ProductImg]), forwardRef(() => ProductsModule)],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
