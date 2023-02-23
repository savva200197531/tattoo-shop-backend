import { IsString } from 'class-validator';

export class BaseFilterDto {
  @IsString()
  public readonly name: string;
}
