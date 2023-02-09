import {
  Controller,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Get,
  Delete,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AddToCartDto } from '@/api/cart/dto/cart.dto';

import { CartService } from './cart.service';
import { Cart } from '@/api/cart/entities/cart.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { JwtAuthGuard } from '@/api/auth/auth.guard';
import { UpdateResult } from 'typeorm';
import { CartResponse } from '@/api/cart/types/types';

@Controller('cart')
export class CartController {
  constructor(@Inject(CartService) private readonly cartService: CartService) {}

  @Put(':user_id')
  @UseGuards(JwtAuthGuard)
  addItem(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Body() body: AddToCartDto,
  ): Promise<object | Cart | UpdateResult> {
    return this.cartService.addToCart(user_id, body);
  }

  @Get(':user_id')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<CartResponse> {
    return this.cartService.findAll(user_id);
  }

  // @Get(':user_id/total-price')
  // @UseGuards(JwtAuthGuard)
  // getTotalPrice(
  //   @Param('user_id', ParseIntPipe) user_id: number,
  // ): Promise<number> {
  //   return this.cartService.getTotalPrice(user_id);
  // }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteFromCart(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.cartService.remove(id);
  }
}
