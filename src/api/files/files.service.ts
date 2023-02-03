import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '@/api/products/products.service';
import { LocalProductImg } from '@/api/files/entities/local-product-img.entity';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(LocalProductImg)
    private readonly localProductImgRepository: Repository<LocalProductImg>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async getProductImgById(id: number): Promise<LocalProductImg> {
    const img = await this.localProductImgRepository.findOneBy({ id });
    if (!img) {
      throw new NotFoundException();
    }
    return img;
  }

  async saveLocalProductImgData(imgData: LocalFileDto, product_id: number) {
    const product = await this.productsService.findProduct(product_id);

    const newImg = await this.localProductImgRepository.create({
      product,
      ...imgData,
    });

    const savedImg = await this.localProductImgRepository.save(newImg);

    let imgIds = [];
    if (product.img_ids) {
      imgIds.push(...product.img_ids);
    }
    imgIds.push(savedImg.id);

    await this.productsService.update(product_id, {
      img_ids: imgIds,
    });

    return savedImg;
  }

  async removeLocalProductImg(id: number) {
    const file = await this.getProductImgById(id);

    await fs.unlink(join(process.cwd(), file.path), (err) => {
      if (err) {
        console.error(err);
        return err;
      }
    });
  }
}
