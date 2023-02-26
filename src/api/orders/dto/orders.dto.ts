import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IPaymentMethodType } from '@a2seven/yoo-checkout/build/types';
import { IWebHookEvent } from '@a2seven/yoo-checkout/build/types/IWebHookEvent';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrderDto {
  @IsNumber()
  @Min(1)
  public readonly price: number;

  @IsNumber()
  public readonly user_id: number;

  @IsString()
  @MinLength(2)
  @MaxLength(32)
  public readonly surname: string;

  @IsString()
  @MinLength(2)
  @MaxLength(32)
  public readonly name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(32)
  public readonly lastname: string;

  @IsEmail()
  public readonly email: string;

  @IsPhoneNumber('RU')
  public readonly phone: string;

  @IsString()
  @MaxLength(32)
  public readonly region: string;

  @IsString()
  @MaxLength(32)
  public readonly city: string;

  @IsString()
  @MaxLength(32)
  public readonly address: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  public readonly comment?: string;

  @IsOptional()
  @IsString()
  public readonly status?: IWebHookEvent;

  @IsString()
  readonly return_url: string;

  @IsString()
  public readonly payment_method: IPaymentMethodType;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
