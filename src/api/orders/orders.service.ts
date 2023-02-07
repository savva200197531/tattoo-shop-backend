import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '@/api/orders/dto/orders.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@/api/orders/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly repository: Repository<Order>,
  ) {}

  create(params: CreateOrderDto) {
    // const newOrder = this.repository.create(params);
    //
    // return this.repository.save(newOrder);
  }
}
