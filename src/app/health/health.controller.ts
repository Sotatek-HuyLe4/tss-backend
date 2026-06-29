import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SwaggerDecorator } from '../../common/decorators/swagger.decorator';
import { HealthService } from './health.service';
import checkHealthSwagger from './swagger/checkHealth.swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @SwaggerDecorator({
    operations: checkHealthSwagger.operations,
    responses: checkHealthSwagger.responses,
  })
  checkHealth() {
    const data = this.healthService.checkHealth();

    return {
      data,
      message: 'Server is running',
    };
  }
}
