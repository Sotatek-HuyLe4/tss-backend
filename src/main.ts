import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set security http headers
  app.use(helmet());

  // set cors
  app.enableCors({
    origin: '*',
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  // gzip compression
  app.use(compression());

  // cookie parser
  app.use(cookieParser());

  // global exception filter
  app.useGlobalFilters();

  // global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // graceful shutdown
  app.enableShutdownHooks();

  // enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // TODO: get config service
  const port = 8000;

  // app logger
  const logger = new Logger(AppModule.name);

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TSS Backend API')
    .setDescription(
      'TSS Backend API for communication with the TSS service and Frontend',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  // start server
  await app.listen(port, () => {
    logger.log(`Server is running on port ${port}`);
  });
}

bootstrap();
