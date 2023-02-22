import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Slide } from '@/api/slider/entities/slide.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from '@/api/files/files.service';
import { ExpressMulterFile } from '@/api/types/file';
import LocalFile from '@/api/files/entities/local-file.entity';
import { CreateSlideDto, UpdateSlideDto } from '@/api/slider/dto/slider.dto';

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
      relations: ['img'],
      order: {
        id: 'DESC',
      },
    });
  }

  public findOne(id: number): Promise<Slide> {
    return this.repository.findOneBy({ id });
  }

  async create(params: CreateSlideDto): Promise<Slide> {
    const img = await this.filesService.findOne(params.img_id);

    if (!img) {
      throw new HttpException('No img found', HttpStatus.NOT_FOUND);
    }

    await this.filesService.update(params.img_id, { is_used: true });

    const newSlide = this.repository.create(params);

    return this.repository.save(newSlide);
  }

  createSlideImg(img: ExpressMulterFile): Promise<LocalFile> {
    return this.filesService.create(img);
  }

  async update(id: number, params: UpdateSlideDto): Promise<UpdateResult> {
    const slide = await this.findOne(id);

    await this.filesService.update(slide.img_id, { is_used: false });

    await this.filesService.update(params.img_id, { is_used: true });

    return this.repository.update({ id }, { ...params });
  }

  public async remove(id: number) {
    const slide = await this.findOne(id);

    if (slide.img_id) {
      await this.filesService.remove(slide.img_id);
    }

    return this.repository.delete({ id });
  }
}
