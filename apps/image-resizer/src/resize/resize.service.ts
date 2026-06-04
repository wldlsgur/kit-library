import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../config/configuration';
import { ImageSource } from './domain/image-source';
import { ResizeOptions } from './domain/resize-options';
import type { ImagePayload } from './image-payload';
import { ImageProcessor } from './infra/image-processor';
import { ImageRepository } from './infra/image.repository';

/**
 * 변환 흐름 조립만 담당(애플리케이션 서비스).
 * 검증 규칙은 값 객체(ImageSource/ResizeOptions), 실제 IO는 인프라(repo/processor)에 위임.
 */
@Injectable()
export class ResizeService {
  private readonly logger = new Logger(ResizeService.name);
  private readonly allowedPrefixes: string[];
  private readonly defaultQuality: number;

  constructor(
    config: ConfigService,
    private readonly repository: ImageRepository,
    private readonly processor: ImageProcessor,
  ) {
    this.allowedPrefixes = config.getOrThrow<AppConfig['allowedPrefixes']>('allowedPrefixes');
    this.defaultQuality = config.getOrThrow<AppConfig['defaultQuality']>('defaultQuality');
  }

  async process(raw: Record<string, unknown>): Promise<ImagePayload> {
    const rawUrl = typeof raw.url === 'string' ? raw.url : '';

    const source = ImageSource.from(rawUrl, this.allowedPrefixes); // 출처 검증
    const options = ResizeOptions.from(raw); // 옵션 파싱/정규화

    const original = await this.repository.fetch(source.url);

    // 변환할 게 없으면 원본 그대로.
    if (!options.hasResize()) {
      return original;
    }

    try {
      return await this.processor.transform(original.data, options, this.defaultQuality);
    } catch (err) {
      // 처리 중 에러는 원본으로 폴백(조용히 넘기지 않게 로그만).
      this.logger.warn(`변환 실패, 원본 반환: ${err instanceof Error ? err.message : err}`);
      return original;
    }
  }
}
