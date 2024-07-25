import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { applyGlobalConfig } from './global-config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import KnightPresenter from './knights/infrastructure/presenters/knight.presenter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = new DocumentBuilder()
    .setTitle('Knights Rest API')
    .setDescription('Uma API Rest feita em Nest.js para manter o KnightModel')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [KnightPresenter],
  });

  SwaggerModule.setup('api', app, document);

  applyGlobalConfig(app);

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
