import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import type { AppConfig } from '../config/configuration';
import { ResizeService } from './resize.service';

@Controller('resize')
export class ResizeController {
  private readonly cacheMaxAge: number;

  constructor(
    private readonly resizer: ResizeService,
    config: ConfigService,
  ) {
    this.cacheMaxAge =
      config.getOrThrow<AppConfig['cacheMaxAge']>('cacheMaxAge');
  }

  @Get()
  async resize(
    @Query() raw: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.resizer.process(raw);

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Cache-Control', `public, max-age=${this.cacheMaxAge}`);
    res.send(result.data);
  }
}
