import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBaseFilterDto {
  @IsString()
  public readonly name: string;
}

export class UpdateBaseFilterDto extends PartialType(CreateBaseFilterDto) {}
