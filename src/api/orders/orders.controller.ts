import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '@/api/orders/dto/orders.dto';
import { JwtAuthGuard } from '@/api/auth/auth.guard';
import { Order } from '@/api/orders/entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }

  @Get(':user_id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Param('user_id', ParseIntPipe) user_id: number): Promise<Order[]> {
    return this.ordersService.findAll(user_id);
  }
}
