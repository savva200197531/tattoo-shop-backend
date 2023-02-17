import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from '@/api/orders/dto/orders.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@/api/orders/entities/order.entity';
import { UserService } from '@/api/user/user.service';
import { CartService } from '@/api/cart/cart.service';
import { OrderProduct } from '@/api/orders/entities/order-product.entity';
import { CreateOrderProduct } from '@/api/orders/types/order-product';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(CartService) private readonly cartService: CartService,
  ) {}

  public findAll(user_id: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: user_id } },
      relations: ['products', 'user'],
    });
  }

  public createOrderProduct(params: CreateOrderProduct): Promise<OrderProduct> {
    const newProduct = this.orderProductRepository.create(params);

    return this.orderProductRepository.save(newProduct);
  }

  async create(params: CreateOrderDto): Promise<Order> {
    const user = await this.userService.findUser(params.user_id);
    const cart = await this.cartService.findAll(params.user_id);

    if (!user) {
      throw new BadRequestException('user not found');
    }

    if (!cart) {
      throw new BadRequestException('cart is empty');
    }

    const products = await Promise.all(
      cart.items.map((item) =>
        this.createOrderProduct({
          ...item.product,
          count: item.count,
        }),
      ),
    );

    const newOrder = this.orderRepository.create({
      ...params,
      user,
      products,
      date: new Date(),
      status: 'Ожидает оплаты',
    });

    const savedOrder = await this.orderRepository.save(newOrder);

    if (savedOrder) {
      await Promise.all(
        cart.items.map((cartItem) => this.cartService.remove(cartItem.id)),
      );
    }

    return savedOrder;
  }
}
