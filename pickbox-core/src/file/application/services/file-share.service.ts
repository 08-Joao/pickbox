import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export enum FileRole {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
}

@Injectable()
export class FileShareService {
  constructor(private readonly prismaService: PrismaService) {}

  async shareFile(fileId: string, userId: string, sharedWithUserId: string, role: FileRole) {
    // Verificar se o arquivo pertence ao usuário
    const file = await this.prismaService.file.findFirst({
      where: {
        id: fileId,
        ownerId: userId,
      },
    });

    if (!file) {
      throw new ForbiddenException('You do not have permission to share this file');
    }

    // Verificar se o usuário a compartilhar existe
    const sharedWithUser = await this.prismaService.user.findUnique({
      where: { id: sharedWithUserId },
    });

    if (!sharedWithUser) {
      throw new BadRequestException('User not found');
    }

    // Não permitir compartilhar com o próprio dono
    if (userId === sharedWithUserId) {
      throw new BadRequestException('Cannot share file with yourself');
    }

    // Criar ou atualizar compartilhamento
    return this.prismaService.fileShare.upsert({
      where: {
        fileId_userId: {
          fileId,
          userId: sharedWithUserId,
        },
      },
      update: {
        role,
      },
      create: {
        fileId,
        userId: sharedWithUserId,
        role,
      },
      include: {
        file: true,
        user: true,
      },
    });
  }

  async unshareFile(fileId: string, userId: string, sharedWithUserId: string) {
    // Verificar se o arquivo pertence ao usuário
    const file = await this.prismaService.file.findFirst({
      where: {
        id: fileId,
        ownerId: userId,
      },
    });

    if (!file) {
      throw new ForbiddenException('You do not have permission to unshare this file');
    }

    return this.prismaService.fileShare.delete({
      where: {
        fileId_userId: {
          fileId,
          userId: sharedWithUserId,
        },
      },
    });
  }

  async getSharedWithMe(userId: string) {
    return this.prismaService.fileShare.findMany({
      where: {
        userId,
      },
      include: {
        file: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getFileShares(fileId: string, userId: string) {
    // Verificar se o arquivo pertence ao usuário
    const file = await this.prismaService.file.findFirst({
      where: {
        id: fileId,
        ownerId: userId,
      },
    });

    if (!file) {
      throw new ForbiddenException('You do not have permission to view shares for this file');
    }

    return this.prismaService.fileShare.findMany({
      where: {
        fileId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async canAccessFile(fileId: string, userId: string): Promise<boolean> {
    // Verificar se é o dono
    const ownedFile = await this.prismaService.file.findFirst({
      where: {
        id: fileId,
        ownerId: userId,
      },
    });

    if (ownedFile) {
      return true;
    }

    // Verificar se foi compartilhado
    const sharedFile = await this.prismaService.fileShare.findFirst({
      where: {
        fileId,
        userId,
      },
    });

    return !!sharedFile;
  }

  async getFileWithAccess(fileId: string, userId: string) {
    const hasAccess = await this.canAccessFile(fileId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this file');
    }

    return this.prismaService.file.findUnique({
      where: { id: fileId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
