import { IsNumber, IsString, Max } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  readonly price: number;

  @IsString()
  readonly return_url: string;

  @IsString()
  @Max(128)
  readonly description: string;

  @IsNumber()
  readonly product_id: number;
}

export class GetPaymentStatusDto {}
