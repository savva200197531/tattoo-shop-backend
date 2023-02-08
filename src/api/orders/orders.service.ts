import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from '@/api/orders/dto/orders.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@/api/orders/entities/order.entity';
import { UserService } from '@/api/user/user.service';
import { CartService } from '@/api/cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly repository: Repository<Order>,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(CartService) private readonly cartService: CartService,
  ) {}

  async create(params: CreateOrderDto) {
    const user = await this.userService.findUser(params.user_id);
    const cart = await this.cartService.findAll(params.user_id);

    const newOrder = this.repository.create({
      ...params,
      user,
      products: cart.map((cartItem) => cartItem.product),
      status: 'Ожидает оплаты',
    });

    return this.repository.save(newOrder);
  }
}
