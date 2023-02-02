import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImg } from "@/api/files/entities/product-img.entity";
import { Repository } from "typeorm";
import { ExpressMulterFile } from "@/api/types/file";
import { ProductsService } from "@/api/products/products.service";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(ProductImg) private readonly productImgRepository: Repository<ProductImg>,
    @Inject(forwardRef(() => ProductsService)) private readonly productsService: ProductsService
  ) {}

  async uploadProductImg(img: ExpressMulterFile, product_id: number) {
    const { originalname, buffer } = img
    const product = await this.productsService.findProduct(product_id)

    const newImg = await this.productImgRepository.create({
      product,
      filename: originalname,
      data: buffer
    })

    return await this.productImgRepository.save(newImg)
  }

  async getProductImgById(id: number): Promise<ProductImg> {
    const file = await this.productImgRepository.findOneBy({ id });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}
