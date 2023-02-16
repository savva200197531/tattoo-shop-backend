import { Inject, Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Slide } from '@/api/slider/entities/slide.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSlide, UpdateSlide } from '@/api/slider/types/slider';
import { FilesService } from '@/api/files/files.service';

@Injectable()
export class SliderService {
  constructor(
    @InjectRepository(Slide)
    private readonly repository: Repository<Slide>,
    @Inject(FilesService)
    private readonly filesService: FilesService,
  ) {}

  findAll() {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  public findOne(id: number): Promise<Slide> {
    return this.repository.findOneBy({ id });
  }

  async create({ img, ...params }: CreateSlide): Promise<Slide> {
    const newSlide = this.repository.create(params);

    const savedSlide = await this.repository.save(newSlide);

    const savedImg = await this.filesService.create(img);

    await this.update(savedSlide.id, {
      img_id: savedImg.id,
    });

    return savedSlide;
  }

  update(id: number, params: UpdateSlide): Promise<UpdateResult> {
    return this.repository.update({ id }, { ...params });
  }

  public async remove(id: number) {
    const product = await this.findOne(id);

    if (product.img_id) {
      await this.filesService.remove(id);
    }

    return this.repository.delete({ id });
  }
}
