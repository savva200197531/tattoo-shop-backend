import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from "@/api/products/entities/product.entity";

import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { Cart } from "@/api/user/entities/cart.entity";
import { ProductsModule } from "@/api/products/products.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Cart]), AuthModule, ProductsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
