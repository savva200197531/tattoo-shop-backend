import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/api/user/entities/user.entity";
import { UserModule } from "@/api/user/user.module";
import { Cart } from "@/api/cart/entities/cart.entity";
import { ProductsModule } from "@/api/products/products.module";

import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart]), UserModule, ProductsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule {}
