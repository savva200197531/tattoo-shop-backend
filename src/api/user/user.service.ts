import { Repository } from 'typeorm';
import { Request } from 'express';

import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { AddCartItemDto, RemoveCartItemDto } from "@/api/user/dto/cart.dto";
import { Product } from "@/api/products/entities/product.entity";

import { UpdateNameDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { Cart } from "@/api/user/entities/cart.entity";
import { ProductsService } from "@/api/products/products.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    private readonly productsService: ProductsService
  ) {}

  public async updateName(body: UpdateNameDto, req: Request): Promise<User> {
    const user: User = <User>req.user;

    user.name = body.name;

    return this.userRepository.save(user);
  }

  public findUser(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      // relations:
    })
  }

  public findCartItem(id: number): Promise<Cart> {
    return this.cartRepository.findOneBy({ id })
  }

  public findAll(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ["product", "user"] })
  }

  async addCartItem(id: number, param: AddCartItemDto) {
    const { product_id, count } = param
    const user = await this.findUser(id)
    const product = await this.productsService.findProduct(product_id)

    if (!user) {
      throw new BadRequestException('user not found')
    }

    if (!product) {
      throw new BadRequestException('product not found')
    }

    if (count > product.count) {
      throw new UnauthorizedException('product is out of stock')
    }

    product.count -= count
    await this.productRepository.save(product)

    const cartItems = await this.findAll()
    const duplicatedProduct = cartItems.find(item => item.product.id === product_id)

    if (duplicatedProduct) {
      duplicatedProduct.count += count

      return this.cartRepository.save(duplicatedProduct)
    } else {
      const newCartItem = this.cartRepository.create({
        count,
        product,
        user,
      });

      return this.cartRepository.save(newCartItem)
    }
  }

  // async removeCartItem(user_id: number, id: number) {
  //   try {
  //     const user = await this.findUser(user_id)
  //     const cartItem = await this.findCartItem(id)
  //     const product = await this.productsService.findProduct(id)
  //
  //     if (!user) {
  //       throw new BadRequestException('user not found')
  //     }
  //
  //     if (!cartItem) {
  //       throw new BadRequestException('cart item not found')
  //     }
  //
  //     const removeProduct = user.cart.find(item => item.product_id === product_id)
  //
  //     if (!removeProduct) {
  //       throw new BadRequestException('cant remove product')
  //     }
  //
  //     // user.cart.filter(item => item.product_id === product_id)
  //
  //     product.count += removeProduct.count
  //
  //     const newCartItem = this.cartRepository.create({
  //       product_id,
  //       // count,
  //       user
  //     })
  //
  //     await this.cartRepository.create({
  //       user,
  //
  //     })
  //     await this.productRepository.save(product).then(null, () => {
  //       throw new ConflictException(
  //         'could not serialize access due to concurrent update'
  //       )
  //     })
  //
  //     return
  //   } catch (err) {
  //     return err
  //   }
  // }
}
