import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/api/orders/entities/order.entity';
import { UserModule } from '@/api/user/user.module';
import { CartModule } from '@/api/cart/cart.module';
import { OrderProduct } from '@/api/orders/entities/order-product.entity';
import { EmailModule } from '@/api/email/email.module';
import { ProductsModule } from '@/api/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct]),
    UserModule,
    CartModule,
    EmailModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
