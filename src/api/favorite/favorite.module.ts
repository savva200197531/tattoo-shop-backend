import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorite } from "@/api/favorite/entities/favorite.entity";
import { ProductsModule } from "@/api/products/products.module";
import { UserModule } from "@/api/user/user.module";

import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), ProductsModule, UserModule],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
