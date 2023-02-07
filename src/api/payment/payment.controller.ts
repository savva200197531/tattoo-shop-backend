import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, GetPaymentStatusDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() body: CreatePaymentDto) {
    return this.paymentService.create(body);
  }

  @Get('get-payment-status')
  getPaymentStatus(@Body() body: any) {
    console.log(123);
    return this.paymentService.getPaymentStatus(body);
  }
}
