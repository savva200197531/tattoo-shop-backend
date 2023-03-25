import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { OrderStatus } from '@/api/orders/types/orderStatus';
import { Type } from 'class-transformer';
import { Cart } from '@/api/cart/entities/cart.entity';

export class CreateOrderDto {
  // user

  @IsNumber()
  @IsOptional()
  public readonly user_id?: number;

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

  @IsPhoneNumber('RU', { message: 'Телефон указан не верно' })
  public readonly phone: string;

  // address

  @IsString()
  public readonly region: string;

  @IsString()
  public readonly city: string;

  @IsString()
  public readonly street: string;

  @IsString()
  public readonly house: string;

  @IsString()
  public readonly apartment: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  public readonly comment?: string;

  // rest

  @IsNumber()
  @Min(1)
  public readonly price: number;

  @IsOptional()
  @IsNumber()
  public readonly status?: OrderStatus;

  @IsArray()
  // @ValidateNested({ each: true })
  @Type(() => Cart)
  cart: Cart[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
