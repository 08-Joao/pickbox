import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class FileLinkService {
  constructor(private readonly prismaService: PrismaService) {}

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  async createLink(fileId: string, userId: string, expiresAt?: Date) {
    // Verificar se o arquivo pertence ao usuário
    const file = await this.prismaService.file.findFirst({
      where: {
        id: fileId,
        ownerId: userId,
      },
    });

    if (!file) {
      throw new ForbiddenException('You do not have permission to create a link for this file');
    }

    const token = this.generateToken();

    return this.prismaService.fileLink.create({
      data: {
        fileId,
        token,
        expiresAt,
      },
    });
  }

  async getFileByToken(token: string) {
    const fileLink = await this.prismaService.fileLink.findUnique({
      where: { token },
      include: {
        file: true,
      },
    });

    if (!fileLink) {
      throw new NotFoundException('Link not found or expired');
    }

    // Verificar se o link expirou
    if (fileLink.expiresAt && new Date() > fileLink.expiresAt) {
      throw new NotFoundException('Link has expired');
    }

    return fileLink.file;
  }

  async getLinks(fileId: string, userId: string) {
    // Verificar se o arquivo pertence ao usuário
    const file = await this.prismaService.file.findFirst({
      where: {
        id: fileId,
        ownerId: userId,
      },
    });

    if (!file) {
      throw new ForbiddenException('You do not have permission to view links for this file');
    }

    return this.prismaService.fileLink.findMany({
      where: { fileId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteLink(linkId: string, userId: string) {
    // Verificar se o link pertence a um arquivo do usuário
    const fileLink = await this.prismaService.fileLink.findUnique({
      where: { id: linkId },
      include: { file: true },
    });

    if (!fileLink) {
      throw new NotFoundException('Link not found');
    }

    if (fileLink.file.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this link');
    }

    return this.prismaService.fileLink.delete({
      where: { id: linkId },
    });
  }

  async deleteLinkByToken(token: string, userId: string) {
    const fileLink = await this.prismaService.fileLink.findUnique({
      where: { token },
      include: { file: true },
    });

    if (!fileLink) {
      throw new NotFoundException('Link not found');
    }

    if (fileLink.file.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this link');
    }

    return this.prismaService.fileLink.delete({
      where: { token },
    });
  }
}
