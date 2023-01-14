import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from "@nestjs/common";
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':id/cart')
  create(@Param('id', ParseIntPipe) id: number, @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(id, createCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }
}
