import { IsString, IsEnum } from 'class-validator';

export class ShareFileDto {
  @IsString()
  sharedWithUserId: string;

  @IsEnum(['VIEWER', 'EDITOR'])
  role: 'VIEWER' | 'EDITOR';
}
