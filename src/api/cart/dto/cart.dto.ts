import { IsInt, Min } from "class-validator";

// export class AddCartItemDto {
//   @IsInt()
//   readonly product_id: number
//
//   @IsInt()
//   @Min(0)
//   readonly count: number
// }
//
// export class RemoveCartItemDto extends AddCartItemDto {
//   @IsInt()
//   readonly cart_item_id: number
// }

export class AddToCartDto {
  @IsInt()
  readonly product_id: number

  @IsInt()
  @Min(0)
  readonly count: number
}
