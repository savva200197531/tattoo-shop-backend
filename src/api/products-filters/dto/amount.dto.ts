import { BaseFilterDto } from '@/api/products-filters/dto/base-filter.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAmountDto extends BaseFilterDto {
  @IsNumber({}, { each: true })
  public readonly category_ids: number[];
}

export class AmountFiltersDto {
  @IsOptional()
  @IsString()
  category_id: string;
}

export class UpdateAmountDto extends PartialType(CreateAmountDto) {}
