import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { ScheduleService } from './schedule.service';

@Module({
  providers: [ScheduleService],
})
export class ScheduleModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly scheduleService: ScheduleService) {}

  onModuleInit() {
    // set module active
    this.scheduleService.setModuleActive(true);

    // start interval fetch vault balances
    this.scheduleService.intervalFetchVaultBalances();
  }

  onModuleDestroy() {
    // set module inactive
    this.scheduleService.setModuleActive(false);
  }
}
