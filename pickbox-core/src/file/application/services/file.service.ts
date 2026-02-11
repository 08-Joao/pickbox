import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateFileDto } from 'src/file/dto/create-file.dto';
import { UpdateFileDto } from 'src/file/dto/update-file.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createFileDto: CreateFileDto, ownerId: string) {
    return this.prismaService.file.create({
      data: {
        ...createFileDto,
        ownerId,
      },
    });
  }

  async findAll(ownerId: string) {
    return this.prismaService.file.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, ownerId: string) {
    return this.prismaService.file.findFirst({
      where: {
        id,
        ownerId,
      },
    });
  }

  async update(id: string, ownerId: string, updateFileDto: UpdateFileDto) {
    return this.prismaService.file.updateMany({
      where: {
        id,
        ownerId,
      },
      data: updateFileDto,
    });
  }

  async updateWithAccess(id: string, userId: string, updateFileDto: UpdateFileDto) {
    // Verificar se é o dono
    const file = await this.prismaService.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new ForbiddenException('File not found');
    }

    // Validar que a extensão não foi alterada
    if (updateFileDto.originalName) {
      const oldExt = this.getFileExtension(file.originalName);
      const newExt = this.getFileExtension(updateFileDto.originalName);

      if (oldExt !== newExt) {
        throw new ForbiddenException('Cannot change file extension');
      }
    }

    if (file.ownerId === userId) {
      // Dono pode atualizar
      return this.prismaService.file.update({
        where: { id },
        data: updateFileDto,
      });
    }

    // Verificar se tem acesso como editor
    const share = await this.prismaService.fileShare.findFirst({
      where: {
        fileId: id,
        userId,
        role: 'EDITOR',
      },
    });

    if (!share) {
      throw new ForbiddenException('You do not have permission to update this file');
    }

    return this.prismaService.file.update({
      where: { id },
      data: updateFileDto,
    });
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return '';
    }
    return filename.substring(lastDotIndex).toLowerCase();
  }

  async remove(id: string, ownerId: string) {
    return this.prismaService.file.deleteMany({
      where: {
        id,
        ownerId,
      },
    });
  }

  async removeWithAccess(id: string, userId: string) {
    // Verificar se é o dono
    const file = await this.prismaService.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new ForbiddenException('File not found');
    }

    if (file.ownerId === userId) {
      // Dono pode deletar
      return this.prismaService.file.delete({
        where: { id },
      });
    }

    // Verificar se tem acesso como editor
    const share = await this.prismaService.fileShare.findFirst({
      where: {
        fileId: id,
        userId,
        role: 'EDITOR',
      },
    });

    if (!share) {
      throw new ForbiddenException('You do not have permission to delete this file');
    }

    return this.prismaService.file.delete({
      where: { id },
    });
  }
}
