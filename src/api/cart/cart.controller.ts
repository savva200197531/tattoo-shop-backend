import { Controller, Body, Param, ParseIntPipe, Put, Get } from "@nestjs/common";
import { AddToCartDto } from "@/api/cart/dto/cart.dto";

import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Put(':user_id/add')
  addItem(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Body() body: AddToCartDto
  ) {
    return this.cartService.addToCart(user_id, body)
  }

  // @Patch(':user_id/remove')
  // removeItem(
  //   @Param('user_id', ParseIntPipe) user_id: number,
  //   @Body() body: RemoveCartItemDto
  // ) {
  //   return this.cartService.removeCartItem(user_id, body)
  // }

  @Get(':user_id')
  findAll(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.cartService.findAll(user_id)
  }
}
