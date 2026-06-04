import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { map, Observable } from 'rxjs';
import type { AppConfig } from '../../config/configuration';

@Injectable()
export class ImageResponseInterceptor implements NestInterceptor {
  private readonly cacheMaxAge: number;

  constructor(config: ConfigService) {
    this.cacheMaxAge =
      config.getOrThrow<AppConfig['cacheMaxAge']>('cacheMaxAge');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<Buffer> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((result: { data: Buffer; contentType: string }) => {
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Cache-Control', `public, max-age=${this.cacheMaxAge}`);

        return result.data;
      }),
    );
  }
}
