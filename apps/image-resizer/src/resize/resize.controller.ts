import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import type { AppConfig } from '../config/configuration';
import { ResizeQueryDto } from './dto/resize-query.dto';
import { AllowedUrlGuard } from './guard/allowed-url.guard';
import { ResizeService } from './resize.service';

@Controller('')
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
  @UseGuards(AllowedUrlGuard)
  async resize(@Query() query: ResizeQueryDto, @Res() res: Response) {
    const result = await this.resizer.process(query);

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Cache-Control', `public, max-age=${this.cacheMaxAge}`);
    res.send(result.data);
  }
}
