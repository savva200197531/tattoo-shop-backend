import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsString()
  public readonly name: string;

  @IsNumber()
  public readonly price: number;

  @IsNumber()
  public readonly count: number;

  @IsNumber()
  public readonly category_id: number;

  @IsNumber({}, { each: true })
  public readonly img_ids: number[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class GetProductsFilterDto {
  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  appointment?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  package?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  search?: string;

  // @IsNumber()
  // @IsOptional()
  // page?: number;
  //
  // @IsNumber()
  // @IsOptional()
  // limit?: number;
  //
  // @IsString()
  // @IsOptional()
  // sort?: string;

  // @IsString()
  // @IsOptional()
  // isNew?: string;

  // @IsString()
  // @IsOptional()
  // isPopular?: string;

  // @IsString()
  // @IsOptional()
  // category?: string;
}
