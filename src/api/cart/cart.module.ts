import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "@/api/products/entities/product.entity";
import { Cart } from "@/api/cart/entities/cart.entity";
import { User } from "@/api/user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Cart])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
