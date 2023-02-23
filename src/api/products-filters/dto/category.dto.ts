import { BaseFilterDto } from '@/api/products-filters/dto/base-filter.dto';
import { IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDto extends BaseFilterDto {
  @IsNumber()
  img_id: number;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
