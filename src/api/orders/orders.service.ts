import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from '@/api/orders/dto/orders.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Order } from '@/api/orders/entities/order.entity';
import { UserService } from '@/api/user/user.service';
import { CartService } from '@/api/cart/cart.service';
import { OrderProduct } from '@/api/orders/entities/order-product.entity';
import { CreateOrderProduct } from '@/api/orders/types/order-product';
import { EmailService } from '@/api/email/email.service';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';
import { ProductsService } from '@/api/products/products.service';
import { Cart } from '@/api/cart/entities/cart.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(CartService) private readonly cartService: CartService,
    @Inject(EmailService) private emailService: EmailService,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(ProductsService) private productsService: ProductsService,
  ) {}

  public findAllWithFilter(user_id: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: user_id } },
      order: {
        id: 'DESC',
      },
      relations: ['products', 'user'],
    });
  }

  public findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      order: {
        id: 'DESC',
      },
      relations: ['products', 'user'],
    });
  }

  findOne(id: number): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['products', 'user'],
    });
  }

  async findOneWithFilter(id: number, user_id: number): Promise<Order> {
    const user = await this.userService.findUser(user_id);

    if (user.role === 'Admin') {
      return this.findOne(id);
    }

    const order = await this.orderRepository.findOne({
      where: { id, user: { id: user_id } },
      relations: ['products', 'user'],
    });

    if (!order) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return order;
  }

  update(id: number, params: UpdateOrderDto): Promise<UpdateResult> {
    return this.orderRepository.update({ id }, { ...params });
  }

  public createOrderProduct(params: CreateOrderProduct): Promise<OrderProduct> {
    const newProduct = this.orderProductRepository.create(params);

    return this.orderProductRepository.save(newProduct);
  }

  async create(params: CreateOrderDto): Promise<Order> {
    const user = params.user_id
      ? await this.userService.findUser(params.user_id)
      : null;

    const products = await Promise.all(
      params.cart.map((item) =>
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
    });

    const order = await this.orderRepository.save(newOrder);

    if (order) {
      await Promise.all(
        params.cart.map((cartItem) =>
          this.productsService.decrementProductCount(
            cartItem.product.id,
            cartItem.count,
          ),
        ),
      );

      await this.sendOrderToEmail(order, params.cart);

      if (params.user_id) {
        await Promise.all(
          params.cart.map((cartItem) => this.cartService.remove(cartItem.id)),
        );
      }
    }

    return order;
  }

  async sendOrderToEmail(order: Order, cart: Cart[]) {
    const options: Mail.Options = {
      subject: `Заказ №${order.id}, от ${order.date}`,
      text: `
        Регион: ${order.region},
        Город: ${order.city},
        Адрес: ${order.street} ${order.house} ${order.apartment},
        Телефон: ${order.phone},
        Почта: ${order.email},
        Оплачено: ${order.price} ₽,
        Товары: ${cart
          .map(
            (cart) =>
              `${this.configService.get('MAIN_URL')}/products/${
                cart.product.id
              }`,
          )
          .join(', ')}
        `,
    };

    await this.emailService.sendMail({
      to: this.configService.get('EMAIL_USER'),
      ...options,
    });

    await this.emailService.sendMail({
      to: order.email,
      ...options,
    });
  }
}
