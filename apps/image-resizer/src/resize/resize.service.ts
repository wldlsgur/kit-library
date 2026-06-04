import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { ResizeQueryDto } from './dto/resize-query.dto';
import { ImageProcessor } from './infra/image-processor';

@Injectable()
export class ResizeService {
  private readonly logger = new Logger(ResizeService.name);

  constructor(private readonly processor: ImageProcessor) {}

  async process(query: ResizeQueryDto) {
    const original = await this.fetchImage(query.url ?? '');

    if (!query.w && !query.h) {
      return original;
    }

    try {
      return await this.processor.transform(original.data, query);
    } catch (error) {
      this.logger.warn(
        `변환 실패, 원본 반환: ${error instanceof Error ? error.message : error}`,
      );

      return original;
    }
  }

  private async fetchImage(url: string) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new NotFoundException();
    }

    const data = Buffer.from(await res.arrayBuffer());
    const contentType =
      res.headers.get('content-type') ?? 'application/octet-stream';

    return { data, contentType };
  }
}
