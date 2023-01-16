import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/api/user/entities/user.entity";
import { UserModule } from "@/api/user/user.module";
import { Product } from "@/api/products/entities/product.entity";
import { Cart } from "@/api/cart/entities/cart.entity";
import { ProductsModule } from "@/api/products/products.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Product]), UserModule, ProductsModule],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
