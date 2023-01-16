import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [UserModule, ProductsModule, OrdersModule, CartModule, EmailModule],
})
export class ApiModule {}
