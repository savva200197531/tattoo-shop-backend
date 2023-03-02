import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrdersModule } from '@/api/orders/orders.module';
import { EmailModule } from '@/api/email/email.module';

@Module({
  imports: [forwardRef(() => OrdersModule), EmailModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
