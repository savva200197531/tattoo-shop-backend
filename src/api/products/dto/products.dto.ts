import { IsNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateProductDto {
  @IsString()
  public readonly name: string

  @IsNumber()
  public readonly price: number

  @IsNumber()
  public readonly count: number
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
