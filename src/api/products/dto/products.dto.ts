import { IsNumber, IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateProductDto {
  @IsString()
  public readonly name: string

  @IsNumber()
  public readonly price: number

  @IsNumber()
  public readonly count: number

  // @IsString()
  // public readonly type?: string
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class GetProductsFilterDto {
  @IsString()
  @IsOptional()
  category?: string
}
