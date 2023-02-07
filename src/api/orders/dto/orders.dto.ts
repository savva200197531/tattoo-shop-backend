import { IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  public readonly price: number;

  @IsNumber({}, { each: true })
  public readonly user_ids: number[];

  @IsNumber({}, { each: true })
  public readonly products_ids: number[];
}
