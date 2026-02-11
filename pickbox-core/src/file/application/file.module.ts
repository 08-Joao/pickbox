import { Module } from '@nestjs/common';
import { FileController } from '../infrastructure/controllers/file.controller';
import { FileService } from './services/file.service';
import { FileShareService } from './services/file-share.service';
import { FileLinkService } from './services/file-link.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FileController],
  providers: [FileService, FileShareService, FileLinkService],
  exports: [FileService, FileShareService, FileLinkService],
})
export class FileModule {}
