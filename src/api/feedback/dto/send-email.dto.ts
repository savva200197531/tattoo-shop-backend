import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class SendFeedbackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  comment: string;
}
