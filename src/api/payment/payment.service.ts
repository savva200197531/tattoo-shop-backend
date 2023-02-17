import { v4 as uuidv4 } from 'uuid';

import {
  CreatePaymentDto,
  GetPaymentStatusDto,
} from '@/api/payment/dto/payment.dto';
import {
  ICapturePayment,
  ICreatePayment,
  YooCheckout,
} from '@a2seven/yoo-checkout';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  checkout = new YooCheckout({
    shopId: this.configService.get('SHOP_ID'),
    secretKey: this.configService.get('PAYMENT_TOKEN'),
  });

  constructor(private readonly configService: ConfigService) {}

  async create(params: CreatePaymentDto) {
    const idempotenceKey = uuidv4();

    const { price, return_url, description } = params;

    const createPayload: ICreatePayment = {
      amount: {
        value: price.toFixed(2),
        currency: 'RUB',
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url,
      },
      description,
    };

    return this.checkout.createPayment(createPayload, idempotenceKey);
  }

  async getPaymentStatus(params: GetPaymentStatusDto) {
    console.log(params);
    if (params.event !== 'payment.waiting_for_capture') return;

    const idempotenceKey = uuidv4();

    const capturePayload: ICapturePayment = {
      amount: params.object.amount,
    };

    const payment = await this.checkout.capturePayment(
      params.object.id,
      capturePayload,
      idempotenceKey,
    );

    console.log(payment);

    return payment;
  }
}
