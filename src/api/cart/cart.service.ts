import { Repository } from 'typeorm';

import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Cart } from '@/api/cart/entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '@/api/products/products.service';
import { UserService } from '@/api/user/user.service';
import { AddToCartDto } from '@/api/cart/dto/cart.dto';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { CartResponse } from '@/api/cart/types/types';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @Inject(ProductsService) private readonly productsService: ProductsService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  formatCartRes(items: Cart[]) {
    return {
      items,
      totalPrice: items.reduce((p, c) => p + c.price, 0),
      totalProductsCount: items.reduce((p, c) => p + c.count, 0),
    };
  }

  public async findAll(user_id: number): Promise<CartResponse> {
    const items = await this.cartRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'product'],
      order: {
        id: 'DESC',
      },
    });

    return this.formatCartRes(items);
  }

  public findOne(id: number): Promise<Cart> {
    return this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
  }

  // findOneByUser(id: number, user_id: number): Promise<Cart> {
  //   return this.cartRepository.findOne({ where: { id, user: { id: user_id } }, relations: ["user", "product"] })
  // }

  // findOneByProduct(id: number, user_id: number): Promise<Cart> {
  //   return this.cartRepository.findOne({ where: { id, user: { id: user_id } }, relations: ["user", "product"] })
  // }

  public findOneByProductAndUser = (product_id: number, user_id: number) => {
    return this.cartRepository.findOne({
      where: { product: { id: product_id }, user: { id: user_id } },
      relations: ['user', 'product'],
    });
  };

  public async addToCart(
    user_id: number,
    param: AddToCartDto,
  ): Promise<object | Cart> {
    const { product_id, count } = param;
    const user = await this.userService.findUser(user_id);
    const product = await this.productsService.findOne(product_id);
    const duplicatedCartItem = await this.findOneByProductAndUser(
      product_id,
      user_id,
    );

    if (!user) {
      throw new BadRequestException('user not found');
    }

    if (!product) {
      throw new BadRequestException('product not found');
    }

    if (count > product.count) {
      throw new UnauthorizedException('product is out of stock');
    }

    if (duplicatedCartItem) {
      if (count === 0) {
        await this.remove(duplicatedCartItem.id);

        return this.findAll(user_id);
      }

      if (count === duplicatedCartItem.count) {
        throw new UnauthorizedException('Количество продуктов не изменилось');
      }

      await this.cartRepository.update(
        { id: duplicatedCartItem.id },
        { count, price: product.price * count },
      );

      return this.findAll(user_id);
    } else {
      const newCartItem = this.cartRepository.create({
        count,
        product,
        price: product.price * count,
        user,
      });

      await this.cartRepository.save(newCartItem);

      return this.findAll(user_id);
    }
  }

  public remove = (id: number): Promise<DeleteResult> => {
    return this.cartRepository.delete({ id });
  };

  // public getTotalPrice = async (user_id: number): Promise<number> => {
  //   const cart = await this.findAll(user_id);
  //
  //   return cart.reduce((p, c) => p + c.price, 0);
  // };
}
