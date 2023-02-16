import { PartialType } from '@nestjs/mapped-types';
import { IsHexColor, IsString } from 'class-validator';

export class CreateSlideDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsHexColor()
  bg_color: string;
}

export class UpdateSlideDto extends PartialType(CreateSlideDto) {}
