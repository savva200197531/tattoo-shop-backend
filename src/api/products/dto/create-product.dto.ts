import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  public readonly name: string

  @IsNumber()
  public readonly price: number

  @IsNumber()
  public readonly count: number
}
