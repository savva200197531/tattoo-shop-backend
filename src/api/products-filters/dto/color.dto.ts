import { BaseFilterDto } from '@/api/products-filters/dto/base-filter.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateColorDto extends BaseFilterDto {
  @IsNumber({}, { each: true })
  public readonly category_ids: number[];

  @IsString()
  public readonly value: string;
}

export class ColorFiltersDto {
  @IsOptional()
  @IsString()
  category_id: string;
}

export class UpdateColorDto extends PartialType(CreateColorDto) {}
