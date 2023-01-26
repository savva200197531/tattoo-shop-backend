import { IsNumber } from "class-validator";

export class AddToFavoriteDto {
  @IsNumber()
  public readonly product_id: number
}
