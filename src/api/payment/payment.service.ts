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
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OrdersService } from '@/api/orders/orders.service';
import { Payment } from '@a2seven/yoo-checkout/build/models';
import { EmailService } from '@/api/email/email.service';

@Injectable()
export class PaymentService {
  checkout = new YooCheckout({
    shopId: this.configService.get('SHOP_ID'),
    secretKey: this.configService.get('PAYMENT_TOKEN'),
  });

  constructor(
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject(EmailService)
    private emailService: EmailService,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
  ) {}

  async create(params: CreatePaymentDto): Promise<Payment> {
    const idempotenceKey = uuidv4();

    const { price, return_url, description } = params;

    const order = await this.ordersService.findOne(params.order_id);

    const createPayload: ICreatePayment = {
      amount: {
        value: price.toFixed(2),
        currency: 'RUB',
      },
      metadata: {
        order_id: params.order_id,
      },
      payment_method_data: {
        type: 'bank_card',
      },
      receipt: {
        customer: {
          full_name: `${order.surname} ${order.name} ${order.lastname}`,
          phone: order.phone,
        },
        items: order.products.map((product) => ({
          description: product.name,
          quantity: product.count.toString(),
          amount: {
            value: product.price.toFixed(2),
            currency: 'RUB',
          },
          vat_code: 2,
          payment_mode: 'full_prepayment',
          payment_subject: 'commodity',
        })),
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
    const order_id = +params.object.metadata.order_id;

    // await this.ordersService.update(order_id, {
    //   status: params.event,
    // });

    if (params.event !== 'payment.waiting_for_capture') return;

    const order = await this.ordersService.findOne(order_id);

    const idempotenceKey = uuidv4();

    const capturePayload: ICapturePayment = {
      amount: params.object.amount,
    };

    const payment = await this.checkout.capturePayment(
      params.object.id,
      capturePayload,
      idempotenceKey,
    );

    if (payment.status === 'succeeded') {
      await this.emailService.sendMail({
        to: this.configService.get('EMAIL_USER'),
        subject: `Заказ №${order_id}, от ${order.date}`,
        text: `
        Регион: ${order.region},
        Город: ${order.city},
        Адрес: ${order.address},
        Телефон: ${order.phone},
        Почта: ${order.email},
        Оплачено: ${order.price},
        Продукты: ${order.products.map((product) => product.name).join(', ')}
        `,
      });

      await this.emailService.sendMail({
        to: order.email,
        subject: `Заказ №${order_id}, от ${order.date}`,
        text: `
        Регион: ${order.region},
        Город: ${order.city},
        Адрес: ${order.address},
        Телефон: ${order.phone},
        Почта: ${order.email},
        Оплачено: ${order.price},
        Продукты: ${order.products.map((product) => product.name).join(', ')}
        `,
      });
    }

    return payment;
  }
}
