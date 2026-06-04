import { BadRequestException, Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import type { AppConfig } from '../config/configuration';
import { parseResizeOptions } from './resize-options';
import { ResizeService } from './resize.service';

@Controller('resize')
export class ResizeController {
  private readonly logger = new Logger(ResizeController.name);

  constructor(
    private readonly resizer: ResizeService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  async resize(@Query() raw: Record<string, unknown>, @Res() res: Response): Promise<void> {
    const url = typeof raw.url === 'string' ? raw.url : '';

    // 원본을 가져오지 못하는 경우만 에러로 취급한다.
    let source: globalThis.Response;
    try {
      source = await fetch(url);
    } catch {
      throw new BadRequestException('원본을 가져오지 못했습니다 (잘못된 url)');
    }
    if (!source.ok) {
      throw new BadRequestException(`원본을 가져오지 못했습니다: ${source.status}`);
    }
    const input = Buffer.from(await source.arrayBuffer());
    const sourceType = source.headers.get('content-type') ?? 'application/octet-stream';

    const maxAge = this.config.getOrThrow<AppConfig['cacheMaxAge']>('cacheMaxAge');
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);

    const options = parseResizeOptions(raw);

    // 치수 미지정 등 변환할 게 없으면 원본 그대로 반환.
    if (!options.w && !options.h) {
      res.setHeader('Content-Type', sourceType);
      res.send(input);
      return;
    }

    try {
      const result = await this.resizer.transform(input, options);
      res.setHeader('Content-Type', result.contentType);
      res.send(result.data);
    } catch (err) {
      // 처리 중 에러는 원본으로 폴백 (조용히 넘기지 않게 로그만 남김).
      this.logger.warn(`변환 실패, 원본 반환: ${err instanceof Error ? err.message : err}`);
      res.setHeader('Content-Type', sourceType);
      res.send(input);
    }
  }
}
