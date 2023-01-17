import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from "@/api/user/auth/auth.module";
import { EmailConfirmationModule } from "@/api/user/email-confirmation/email-confirmation.module";

@Module({
  imports: [UserModule, ProductsModule, OrdersModule, CartModule, EmailModule, AuthModule, EmailConfirmationModule],
})
export class ApiModule {}
