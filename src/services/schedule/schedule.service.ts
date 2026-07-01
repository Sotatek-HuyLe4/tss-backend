import { Inject, Injectable, Logger } from '@nestjs/common';

import { EvmService } from '../evm/evm.service';
import { PRISMA_SERVICE } from '../prisma/constant';
import { PrismaClient } from '../../../generated/prisma/client';
import { ethers } from 'ethers';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  private isModuleActive = false;

  constructor(
    private readonly evmService: EvmService,
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaClient,
  ) {}

  setModuleActive(active: boolean) {
    this.isModuleActive = active;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async intervalFetchVaultBalances() {
    this.logger.log('Fetching vault balances...');

    while (this.isModuleActive) {
      // get all users
      const users = await this.prismaService.user.findMany();

      for (let i = 0; i < users.length; i += 10) {
        const usersChunk = users.slice(i, i + 10);

        await Promise.all(
          usersChunk.map(async (user) => {
            if (!user.address) {
              return;
            }

            const balance = await this.evmService.getBalance(user.address);
            const balanceInEth = ethers.formatEther(balance);

            // update user balance
            await this.prismaService.user.update({
              where: { id: user.id },
              data: { balance: balanceInEth },
            });
          }),
        );
      }
      try {
      } catch (error) {
        this.logger.error('Error fetching vault balances: ', error);
      }

      // sleep for 5 seconds
      await this.sleep(5_000);
    }
  }
}
