import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsString()
  public readonly name: string;

  @IsOptional()
  @IsString()
  public readonly description: string;

  @IsNumber()
  public readonly price: number;

  @IsNumber()
  public readonly count: number;

  @IsNumber()
  public readonly category_id: number;

  @IsOptional()
  @IsNumber()
  public readonly color_id: number;

  @IsOptional()
  @IsNumber()
  public readonly amount_id: number;

  @IsOptional()
  @IsNumber()
  public readonly quantity_id: number;

  @IsNumber()
  public readonly brand_id: number;

  @IsNumber({}, { each: true })
  public readonly img_ids: number[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class GetProductsFilterDto {
  @IsNumber()
  @IsOptional()
  price_min?: number;

  @IsNumber()
  @IsOptional()
  price_max?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  category_id?: number;

  @IsNumber()
  @IsOptional()
  brand_id?: number;
}

export class GetPriceRangeFilterDto {
  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
