import { IsString, IsOptional } from 'class-validator';

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  originalName?: string;
}
