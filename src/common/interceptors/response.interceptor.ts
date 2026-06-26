import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Reponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Reponse<T>> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Reponse<T>> {
    return next.handle().pipe(
      map((res: any) => ({
        success: true,
        data: res.data,
        message: res.message,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
