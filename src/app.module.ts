import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import configs, { configSchema } from './configs';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { HealthModule } from './app/health/health.module';
import { PrismaModule } from './services/prisma/prisma.module';

@Module({
  imports: [
    // configs module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
      validationSchema: configSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),

    // cache module
    CacheModule.register({
      isGlobal: true,
    }),

    // services module
    PrismaModule,

    // app modules
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
