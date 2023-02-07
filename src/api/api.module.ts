import { Module } from '@nestjs/common';
import { EmailConfirmationModule } from "@/api/email-confirmation/email-confirmation.module";
import { AuthModule } from "@/api/auth/auth.module";

import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { EmailModule } from './email/email.module';
import { FavoriteModule } from './favorite/favorite.module';
import { FilesModule } from './files/files.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    AuthModule,
    CartModule,
    EmailModule,
    EmailConfirmationModule,
    OrdersModule,
    ProductsModule,
    UserModule,
    FavoriteModule,
    FilesModule,
    PaymentModule
  ],
})
export class ApiModule {}
