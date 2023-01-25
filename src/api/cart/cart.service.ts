import { Repository } from "typeorm";

import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Cart } from "@/api/cart/entities/cart.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductsService } from "@/api/products/products.service";
import { UserService } from "@/api/user/user.service";
import { AddToCartDto } from "@/api/cart/dto/cart.dto";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    private readonly productsService: ProductsService,
    private readonly userService: UserService
  ) {}


  public findCartItem(id: number, user_id: number): Promise<Cart> {
    return this.cartRepository.findOne({ where: { id, user: { id: user_id } }, relations: ["user", "product"] })
  }

  public async findAll(user_id: number): Promise<Cart[]> {
    return this.cartRepository.find({ where: { user: { id: user_id } }, relations: ["user", "product"] })
  }

  public async addToCart(user_id: number, param: AddToCartDto): Promise<DeleteResult | Cart> {
    const { product_id, count } = param
    const user = await this.userService.findUser(user_id)
    const product = await this.productsService.findProduct(product_id)
    const cartItems = await this.findAll(user_id)
    const duplicatedCartItem = cartItems.find(({ product }) => product.id === product_id)
    // const duplicatedCartItem = undefined

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
        return this.deleteFromCart(duplicatedCartItem.id)
      }

      if (count === duplicatedCartItem.count) {
        throw new UnauthorizedException('product count doesnt change')
      }

      duplicatedCartItem.count = count
      duplicatedCartItem.price = product.price * count

      return this.cartRepository.save(duplicatedCartItem)
    } else {
      const newCartItem = this.cartRepository.create({
        count,
        product,
        price: product.price * count,
        user,
      });

      return this.cartRepository.save(newCartItem)
    }
  }

  public deleteFromCart = (id: number): Promise<DeleteResult> => {
    return this.cartRepository.delete({ id })
  }
}
