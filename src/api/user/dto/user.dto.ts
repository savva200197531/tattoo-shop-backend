import { IsOptional, IsString } from 'class-validator';

export class UpdateNameDto {
  @IsString()
  @IsOptional()
  public readonly name?: string;
}

export class GetUserByJwtDto {
  @IsString()
  public readonly token: string
}
