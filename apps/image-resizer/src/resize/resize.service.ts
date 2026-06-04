import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import type { AppConfig } from '../config/configuration';
import type { Format, ResizeOptions } from './resize-options';

export interface TransformResult {
  data: Buffer;
  contentType: string;
}

const FORMAT_CONTENT_TYPE: Record<Format, string> = {
  webp: 'image/webp',
  avif: 'image/avif',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

@Injectable()
export class ResizeService {
  constructor(private readonly config: ConfigService) {}

  async transform(input: Buffer, options: ResizeOptions): Promise<TransformResult> {
    const quality =
      options.quality ?? this.config.getOrThrow<AppConfig['defaultQuality']>('defaultQuality');

    let pipeline = sharp(input).rotate(); // EXIF 방향 자동 보정

    if (options.w || options.h) {
      pipeline = pipeline.resize({
        width: options.w,
        height: options.h,
        fit: options.fit ?? 'cover',
      });
    }

    const targetFormat = await this.resolveFormat(input, options.format);
    const data = await this.applyFormat(pipeline, targetFormat, quality).toBuffer();

    return { data, contentType: FORMAT_CONTENT_TYPE[targetFormat] };
  }

  /** format 미지정 시 원본 포맷 유지(지원 목록에 없으면 webp로 대체). */
  private async resolveFormat(input: Buffer, requested?: Format): Promise<Format> {
    if (requested) return requested;
    const { format } = await sharp(input).metadata();
    switch (format) {
      case 'jpeg':
      case 'png':
      case 'webp':
      case 'avif':
        return format;
      default:
        return 'webp';
    }
  }

  private applyFormat(pipeline: sharp.Sharp, format: Format, quality: number): sharp.Sharp {
    switch (format) {
      case 'webp':
        return pipeline.webp({ quality });
      case 'avif':
        return pipeline.avif({ quality });
      case 'jpeg':
        return pipeline.jpeg({ quality, mozjpeg: true });
      case 'png':
        return pipeline.png({ quality });
    }
  }
}
