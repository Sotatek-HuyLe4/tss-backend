import { Module } from '@nestjs/common';

import configs, { configSchema } from './configs';
import { ConfigModule } from '@nestjs/config';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
