import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, BadRequestException, Res } from '@nestjs/common';
import type { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateFileDto } from '../../dto/create-file.dto';
import { UpdateFileDto } from '../../dto/update-file.dto';
import { ShareFileDto } from '../../dto/share-file.dto';
import { FileService } from 'src/file/application/services/file.service';
import { FileShareService } from 'src/file/application/services/file-share.service';
import { FileLinkService } from 'src/file/application/services/file-link.service';
import { AuthGuard } from 'src/auth/infrastructure/guards/auth.guard';
import { User } from 'src/auth/infrastructure/decorators/user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');

// Criar diretório de uploads se não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly fileShareService: FileShareService,
    private readonly fileLinkService: FileLinkService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          cb(null, `${name}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname) {
          return cb(new BadRequestException('Invalid file'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadedFiles: any[] = [];

    for (const file of files) {
      const createFileDto: CreateFileDto = {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`,
      };

      const savedFile = await this.fileService.create(createFileDto, user.id);
      uploadedFiles.push(savedFile);
    }

    return {
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@User() user: any) {
    return this.fileService.findAll(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @User() user: any) {
    return this.fileService.findOne(id, user.id);
  }

  @Get('download/:id')
  @UseGuards(AuthGuard)
  async downloadFile(
    @Param('id') id: string,
    @User() user: any,
    @Res() res: Response,
  ) {
    // Verificar se o usuário tem acesso ao arquivo (dono ou compartilhado)
    const file = await this.fileShareService.getFileWithAccess(id, user.id);
    if (!file) {
      throw new BadRequestException('File not found or access denied');
    }

    const filePath = path.join(uploadDir, file.filename);
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found on disk');
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.originalName)}"`,
    );
    res.setHeader('Content-Length', file.size);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto,
    @User() user: any,
  ) {
    return this.fileService.updateWithAccess(id, user.id, updateFileDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @User() user: any) {
    // Buscar arquivo para deletar do disco
    const file = await this.prismaService.file.findUnique({
      where: { id },
    });

    if (file) {
      const filePath = path.join(uploadDir, file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return this.fileService.removeWithAccess(id, user.id);
  }

  @Post(':id/share')
  @UseGuards(AuthGuard)
  async shareFile(
    @Param('id') id: string,
    @Body() shareFileDto: ShareFileDto,
    @User() user: any,
  ) {
    return this.fileShareService.shareFile(
      id,
      user.id,
      shareFileDto.sharedWithUserId,
      shareFileDto.role as any,
    );
  }

  @Delete(':id/share/:userId')
  @UseGuards(AuthGuard)
  async unshareFile(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @User() user: any,
  ) {
    return this.fileShareService.unshareFile(id, user.id, userId);
  }

  @Get(':id/shares')
  @UseGuards(AuthGuard)
  async getFileShares(@Param('id') id: string, @User() user: any) {
    return this.fileShareService.getFileShares(id, user.id);
  }

  @Get('shared/with-me')
  @UseGuards(AuthGuard)
  async getSharedWithMe(@User() user: any) {
    return this.fileShareService.getSharedWithMe(user.id);
  }

  @Post(':id/links')
  @UseGuards(AuthGuard)
  async createLink(
    @Param('id') id: string,
    @Body() body: { expiresAt?: string },
    @User() user: any,
  ) {
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined;
    return this.fileLinkService.createLink(id, user.id, expiresAt);
  }

  @Get('public/download/:token')
  async downloadByLink(@Param('token') token: string, @Res() res: Response) {
    const file = await this.fileLinkService.getFileByToken(token);

    const filePath = path.join(uploadDir, file.filename);
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found on disk');
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.originalName)}"`,
    );
    res.setHeader('Content-Length', file.size);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Get('public/info/:token')
  async getFileInfoByLink(@Param('token') token: string) {
    const file = await this.fileLinkService.getFileByToken(token);
    return {
      id: file.id,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      createdAt: file.createdAt,
    };
  }

  @Get(':id/links')
  @UseGuards(AuthGuard)
  async getLinks(@Param('id') id: string, @User() user: any) {
    return this.fileLinkService.getLinks(id, user.id);
  }

  @Delete('links/:linkId')
  @UseGuards(AuthGuard)
  async deleteLink(@Param('linkId') linkId: string, @User() user: any) {
    return this.fileLinkService.deleteLink(linkId, user.id);
  }
}
