import { Repository, UpdateResult } from 'typeorm';

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

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @Inject(ProductsService) private readonly productsService: ProductsService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  public async findAll(user_id: number): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'product'],
      order: {
        id: 'DESC',
      },
    });
  }

  // public findOne(id: number): Promise<Cart> {
  //   return this.cartRepository.findOne({ where: { id }, relations: ["user", "product"] })
  // }
  //
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
  ): Promise<object | Cart | UpdateResult> {
    const { product_id, count } = param;
    const user = await this.userService.findUser(user_id);
    const product = await this.productsService.findProduct(product_id);
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

        return { action: 'delete' };
      }

      if (count === duplicatedCartItem.count) {
        throw new UnauthorizedException('product count doesnt change');
      }

      return this.cartRepository.update(
        { id: duplicatedCartItem.id },
        { count, price: product.price * count },
      );
    } else {
      const newCartItem = this.cartRepository.create({
        count,
        product,
        price: product.price * count,
        user,
      });

      return this.cartRepository.save(newCartItem);
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
