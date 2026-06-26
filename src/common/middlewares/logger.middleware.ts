import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      if (statusCode >= 400) {
        this.logger.error(
          `[${method}] ${originalUrl} ${statusCode} - ${responseTime}ms - ${ip} - ${userAgent}`,
        );
      } else {
        this.logger.log(
          `[${method}] ${originalUrl} ${statusCode} - ${responseTime}ms - ${ip} - ${userAgent}`,
        );
      }
    });

    next();
  }
}
