import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  checkHealth() {
    return {
      status: HttpStatus.OK,
    };
  }
}
