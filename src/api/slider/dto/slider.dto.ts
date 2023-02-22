import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';

export class CreateSlideDto {
  @IsString()
  link: string;

  @IsNumber()
  img_id: number;
}

export class UpdateSlideDto extends PartialType(CreateSlideDto) {}
