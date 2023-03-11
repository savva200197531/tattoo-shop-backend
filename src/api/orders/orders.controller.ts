import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '@/api/orders/dto/orders.dto';
import { JwtAuthGuard } from '@/api/auth/auth.guard';
import { Order } from '@/api/orders/entities/order.entity';
import RoleGuard from '@/api/user/role.guard';
import Role from '@/api/user/role.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() body: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  findAllWithFilter(
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<Order[]> {
    return this.ordersService.findAllWithFilter(user_id);
  }

  @Get('all')
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<Order> {
    return this.ordersService.findOneWithFilter(id, user_id);
  }
}
