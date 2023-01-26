import { Controller, Body, Param, ParseIntPipe, Put, Get, Delete, UseGuards, Inject } from "@nestjs/common";
import { AddToCartDto } from "@/api/cart/dto/cart.dto";

import { CartService } from './cart.service';
import { Cart } from "@/api/cart/entities/cart.entity";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";
import { JwtAuthGuard } from "@/api/auth/auth.guard";

@Controller('cart')
export class CartController {
  constructor(@Inject(CartService) private readonly cartService: CartService) {}

  @Put(':user_id')
  @UseGuards(JwtAuthGuard)
  addItem(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Body() body: AddToCartDto
  ): Promise<DeleteResult | Cart> {
    return this.cartService.addToCart(user_id, body)
  }

  @Get(':user_id')
  @UseGuards(JwtAuthGuard)
  findAll(@Param('user_id', ParseIntPipe) user_id: number): Promise<Cart[]> {
    return this.cartService.findAll(user_id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteFromCart(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.cartService.deleteFromCart(id)
  }
}
