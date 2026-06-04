import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../../config/configuration';

@Injectable()
export class AllowedUrlGuard implements CanActivate {
  private readonly allowedPrefixes: string[];

  constructor(config: ConfigService) {
    this.allowedPrefixes =
      config.getOrThrow<AppConfig['allowedPrefixes']>('allowedPrefixes');
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const rawUrl = (request.query.url as string) ?? '';

    let parsed: URL;

    try {
      parsed = new URL(rawUrl);
    } catch {
      throw new NotFoundException();
    }

    const target = `${parsed.host}${parsed.pathname}`.toLowerCase();

    if (!this.allowedPrefixes.some((p) => target.startsWith(p))) {
      throw new NotFoundException();
    }

    return true;
  }
}
