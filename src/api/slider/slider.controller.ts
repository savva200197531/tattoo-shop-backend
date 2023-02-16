import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Get()
  findAll() {
    return this.sliderService.findAll();
  }

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(
    LocalFileInterceptor({
      fieldName: 'img',
      path: '/slider-images',
    }),
  )
  create(@Body() body: CreateSlideDto, @UploadedFile() img: ExpressMulterFile) {
    return this.sliderService.create({ img, ...body });
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateSlideDto) {
    return this.sliderService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private remove(@Param('id', ParseIntPipe) id: number) {
    return this.sliderService.remove(id);
  }
}
