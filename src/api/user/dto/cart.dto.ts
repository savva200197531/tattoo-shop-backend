import { IsInt, Min } from "class-validator";

export class AddCartItemDto {
  @IsInt()
  readonly product_id: number

  @IsInt()
  @Min(0)
  readonly count: number
}

export class RemoveCartItemDto {

}
