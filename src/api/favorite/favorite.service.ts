import { Repository } from "typeorm";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";

import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favorite } from "@/api/favorite/entities/favorite.entity";
import { AddToFavoriteDto } from "@/api/favorite/dto/favorite.dto";
import { ProductsService } from "@/api/products/products.service";
import { UserService } from "@/api/user/user.service";

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite) private readonly favoriteRepository: Repository<Favorite>,
    @Inject(ProductsService) private readonly productsService: ProductsService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  public findAll(user_id: number): Promise<Favorite[]> {
    return this.favoriteRepository.find({ where: { user: { id: user_id } }, relations: ["user", "product"] })
  }

  public findDuplicate = (user_id: number, product_id: number) => {
    return this.favoriteRepository.findOne({ where: { user: { id: user_id }, product: { id: product_id } }, relations: ["user"] })
  }

  public async addToFavorite(user_id: number, param: AddToFavoriteDto): Promise<Favorite> {
    const { product_id } = param

    const product = await this.productsService.findProduct(product_id)
    const user = await this.userService.findUser(user_id)
    const duplicatedFavoriteProduct = await this.findDuplicate(user_id, product_id)

    if (!user) {
      throw new BadRequestException('user not found')
    }

    if (!product) {
      throw new BadRequestException('product not found')
    }

    if (duplicatedFavoriteProduct) {
      throw new BadRequestException('product is already in favorite')
    }

    const newFavorite = this.favoriteRepository.create({
      product,
      user,
    });

    return this.favoriteRepository.save(newFavorite)
  }

  public remove(id: number): Promise<DeleteResult> {
    return this.favoriteRepository.delete({ id })
  }
}
