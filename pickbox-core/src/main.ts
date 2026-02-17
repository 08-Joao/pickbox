import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(express.json({ limit: '1gb' }));
  app.use(express.urlencoded({ limit: '1gb', extended: true }));
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Servir arquivos estáticos da pasta uploads
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  await app.listen(4000);
}

bootstrap();
