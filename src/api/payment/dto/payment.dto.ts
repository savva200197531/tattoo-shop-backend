import { IsNumber, IsString, MaxLength } from 'class-validator';
import { IAmount } from '@a2seven/yoo-checkout/build/types';
import { IPaymentStatus } from '@a2seven/yoo-checkout/build/types/IPaymentStatus';
import { IWebHookEvent } from '@a2seven/yoo-checkout/build/types/IWebHookEvent';

export class CreatePaymentDto {
  @IsNumber()
  readonly price: number;

  @IsString()
  readonly return_url: string;

  @IsNumber()
  readonly order_id: number;

  @IsString()
  @MaxLength(128)
  readonly description: string;
}

class ObjectPayment {
  id: string;
  status: IPaymentStatus;
  amount: IAmount;
  description: string;
  recipient: { account_id: string; gateway_id: string };
  payment_method: {
    type: string;
    id: string;
    saved: boolean;
    title: string;
    card: [Object];
  };
  created_at: string;
  expires_at: string;
  test: boolean;
  paid: boolean;
  refundable: boolean;
  metadata: {
    order_id: string;
  };
  authorization_details: {
    rrn: string;
    auth_code: string;
    three_d_secure: [Object];
  };
}

export class GetPaymentStatusDto {
  event: IWebHookEvent;
  type: string;
  object: ObjectPayment;
}
