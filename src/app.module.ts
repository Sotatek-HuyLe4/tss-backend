import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';

import configs, { configSchema } from './configs';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { HealthModule } from './app/health/health.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { TssModule } from './app/tss/tss.module';
import { EvmModule } from './services/evm/evm.module';

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

    // http module
    HttpModule.register({
      global: true,
      timeout: 60_000,
      maxRedirects: 5,
    }),

    // services module
    PrismaModule,
    EvmModule,

    // app modules
    HealthModule,
    TssModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
