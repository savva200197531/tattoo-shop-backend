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
  private createSlideImg(@UploadedFile() img: ExpressMulterFile) {
    return this.sliderService.createSlideImg(img);
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
