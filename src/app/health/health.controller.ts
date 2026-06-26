import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  checkHealth() {
    const data = this.healthService.checkHealth();

    return {
      data,
      message: 'Server is running',
    };
  }
}
