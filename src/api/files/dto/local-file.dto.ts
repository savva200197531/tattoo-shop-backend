import { IsBoolean, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateLocalFileDto {
  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsString()
  mimetype: string;
}

export class UpdateLocalFileDto extends PartialType(CreateLocalFileDto) {
  @IsBoolean()
  is_used: boolean;
}
