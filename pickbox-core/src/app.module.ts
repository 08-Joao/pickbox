import { Module } from '@nestjs/common';
import { UserModule } from './user/application/user.module';
import { AuthModule } from './auth/application/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FileModule } from './file/application/file.module';
import { AuthService } from './auth/application/services/auth.service';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, FileModule],
  providers: [AuthService],
})
export class AppModule {}
