import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import RoleGuard from '@/api/user/role.guard';
import Role from '@/api/user/role.enum';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ColorsService } from '@/api/products-filters/services/colors/colors.service';
import {
  ColorFiltersDto,
  CreateColorDto,
  UpdateColorDto,
} from '@/api/products-filters/dto/color.dto';
import { Color } from '@/api/products-filters/entities/color.entity';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  findAll(@Query() query: ColorFiltersDto): Promise<Color[]> {
    if (Object.values(query).length) {
      return this.colorsService.findAllWithFilters(+query.category_id);
    }
    return this.colorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Color> {
    return this.colorsService.findOne(id);
  }

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  create(@Body() body: CreateColorDto): Promise<Color> {
    return this.colorsService.create(body);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateColorDto,
  ): Promise<UpdateResult> {
    return this.colorsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  private remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.colorsService.remove(id);
  }
}
