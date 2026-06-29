import { Inject, Logger, Module, OnModuleDestroy } from '@nestjs/common';

import { prismaProvider } from './prisma.provider';
import { PrismaClient } from '../../../generated/prisma/client';
import { PRISMA_SERVICE } from './constant';

@Module({
  imports: [],
  providers: [prismaProvider],
  exports: [prismaProvider],
})
export class PrismaModule implements OnModuleDestroy {
  private readonly logger = new Logger(PrismaModule.name);

  constructor(
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaClient,
  ) {}

  async onModuleDestroy() {
    await this.prismaService.$disconnect();

    this.logger.log('Disconnected from database');
  }
}
