import { Controller, Body, Param, ParseIntPipe, Patch, Put } from "@nestjs/common";
import { AddCartItemDto, RemoveCartItemDto } from "@/api/cart/dto/cart.dto";

import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Put(':user_id/add')
  addItem(
    @Param('user_id', ParseIntPipe) user_id: number, // user id
    @Body() body: AddCartItemDto
  ) {
    return this.cartService.addCartItem(user_id, body)
  }

  @Patch(':user_id/remove')
  removeItem(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Body() body: RemoveCartItemDto
  ) {
    return this.cartService.removeCartItem(user_id, body)
  }
}
