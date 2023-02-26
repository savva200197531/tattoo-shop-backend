import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @Post()
  // create(@Body() body: CreatePaymentDto) {
  //   return this.paymentService.create(body);
  // }

  // @Get('get-payment-status')
  // getPaymentStatus(@Body() body: any) {
  //   return this.paymentService.getPaymentStatus(body);
  // }

  @Post('status')
  getPaymentStatus(@Body() body: any) {
    return this.paymentService.getPaymentStatus(body);
  }
}
