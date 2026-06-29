import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../../generated/prisma/client';
import { PRISMA_SERVICE } from './constant';

export const prismaProvider = {
  provide: PRISMA_SERVICE,
  useFactory: async (configService: ConfigService) => {
    const adapter = new PrismaPg({
      connectionString: configService.get('databaseUrl'),
    });
    const prisma = new PrismaClient({ adapter });
    const logger = new Logger(PRISMA_SERVICE);

    // connect to database
    await prisma.$connect();
    logger.log('Connected to database');

    return prisma;
  },
  inject: [ConfigService],
};
