import { Repository } from "typeorm";

import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Cart } from "@/api/cart/entities/cart.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductsService } from "@/api/products/products.service";
import { UserService } from "@/api/user/user.service";
import { AddToCartDto } from "@/api/cart/dto/cart.dto";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    private readonly productsService: ProductsService,
    private readonly userService: UserService
  ) {}


  public findCartItem(id: number, user_id: number): Promise<Cart> {
    return this.cartRepository.findOne({ where: { id, user: { id: user_id } }, relations: ["user"] })
  }

  public async findAll(user_id: number): Promise<Cart[]> {
    return this.cartRepository.find({ where: { user: { id: user_id } }, relations: ["user"] })
  }

  // async addCartItem(user_id: number, param: AddCartItemDto): Promise<Cart | UpdateResult> {
  //   const { product_id, count } = param
  //   const user = await this.userService.findUser(user_id)
  //   const product = await this.productsService.findProduct(product_id)
  //
  //   if (!user) {
  //     throw new BadRequestException('user not found')
  //   }
  //
  //   if (!product) {
  //     throw new BadRequestException('product not found')
  //   }
  //
  //   if (count > product.count) {
  //     throw new UnauthorizedException('product is out of stock')
  //   }
  //
  //   product.count -= count
  //   await this.productsService.update(product.id, { count: product.count })
  //
  //   const cartItems = await this.findAll()
  //   const duplicatedProduct = cartItems.find(item => item.product.id === product_id)
  //
  //   if (duplicatedProduct && duplicatedProduct.user.id === user_id) {
  //     duplicatedProduct.count += count
  //
  //     return this.cartRepository.update(duplicatedProduct.id, { count: duplicatedProduct.count })
  //   } else {
  //     const newCartItem = this.cartRepository.create({
  //       count,
  //       product,
  //       user,
  //     });
  //
  //     return this.cartRepository.save(newCartItem)
  //   }
  // }
  //
  // async removeCartItem(user_id: number, param: RemoveCartItemDto): Promise<UpdateResult | DeleteResult> {
  //   const { product_id, cart_item_id, count } = param
  //   const user = await this.userService.findUser(user_id)
  //   const cartItem = await this.findCartItem(cart_item_id)
  //   const product = await this.productsService.findProduct(product_id)
  //
  //   if (!user) {
  //     throw new BadRequestException('user not found')
  //   }
  //
  //   if (!cartItem) {
  //     throw new BadRequestException('cart item not found')
  //   }
  //
  //   if (!product) {
  //     throw new BadRequestException('product not found')
  //   }
  //
  //   product.count += count
  //   await this.productsService.update(product.id, { count: product.count })
  //
  //   if (cartItem.count - count > 0) {
  //     cartItem.count -= count
  //
  //     return this.cartRepository.update(cartItem.id, { count: cartItem.count })
  //   } else {
  //     return this.cartRepository.delete({ id: cart_item_id })
  //   }
  // }

  async addToCart(user_id: number, param: AddToCartDto) {
    const { product_id, count } = param
    const user = await this.userService.findUser(user_id)
    const product = await this.productsService.findProduct(product_id)
    const cartItems = await this.findAll(user_id)
    const duplicatedCartItem = cartItems.find(item => item.product_id === product_id)

    if (!user) {
      throw new BadRequestException('user not found')
    }

    if (!product) {
      throw new BadRequestException('product not found')
    }

    if (count > product.count) {
      throw new UnauthorizedException('product is out of stock')
    }

    if (duplicatedCartItem) {
      if (count === 0) {
        return this.cartRepository.delete({ id: duplicatedCartItem.id })
      }

      if (count === duplicatedCartItem.count) {
        throw new UnauthorizedException('product count doesnt change')
      }

      duplicatedCartItem.count = count

      return this.cartRepository.save(duplicatedCartItem)
    } else {
      const newCartItem = this.cartRepository.create({
        count,
        product_id,
        user,
      });

      return this.cartRepository.save(newCartItem)
    }
  }
}
