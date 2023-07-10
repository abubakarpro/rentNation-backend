import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const apiPrefix: string = `api/${configService.get('API_VERSION')}`;
  const apiValidationPipes: ValidationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true },
  });

  const config = new DocumentBuilder()
    .setTitle('RentNation')
    .setDescription('The RentNation API description')
    .setVersion('0.1')
    .build();

  app.enableCors();
  app.enableCors({ origin: '*', credentials: true });
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(apiValidationPipes);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(Number(configService.get('PORT')) || 3001);
}
bootstrap();
