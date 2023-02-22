import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SliderService } from './slider.service';
import { CreateSlideDto, UpdateSlideDto } from '@/api/slider/dto/slider.dto';
import { ExpressMulterFile } from '@/api/types/file';
import RoleGuard from '@/api/user/role.guard';
import Role from '@/api/user/role.enum';
import LocalFileInterceptor from '@/api/files/interceptors/local-file.interceptor';
import { FilesService } from '@/api/files/files.service';
import LocalFile from '@/api/files/entities/local-file.entity';

@Controller('slider')
export class SliderController {
  constructor(
    private readonly sliderService: SliderService,
    @Inject(FilesService)
    private readonly filesService: FilesService,
  ) {}

  @Get()
  private findAll() {
    return this.sliderService.findAll();
  }

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  private create(@Body() body: CreateSlideDto) {
    return this.sliderService.create(body);
  }

  @Post('upload-img')
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(
    LocalFileInterceptor({
      fieldName: 'img',
      path: '/slider-images',
    }),
  )
  private createSlideImg(
    @UploadedFile() img: ExpressMulterFile,
  ): Promise<LocalFile> {
    return this.filesService.create(img);
  }

  @Patch(':id')
  private update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateSlideDto,
  ) {
    return this.sliderService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private remove(@Param('id', ParseIntPipe) id: number) {
    return this.sliderService.remove(id);
  }
}
