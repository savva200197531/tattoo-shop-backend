import { IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateProductDto {
  @IsString()
  public readonly name: string

  @IsString()
  public readonly price: string

  @IsString()
  public readonly count: string
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class GetProductsFilterDto {
  @IsString()
  @IsOptional()
  category?: string
}
