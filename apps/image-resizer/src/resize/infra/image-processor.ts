import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import {
  FORMAT_VALUES,
  type Format,
  type ResizeQueryDto,
} from '../dto/resize-query.dto';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration';

const FORMAT_CONTENT_TYPE: Record<Format, string> = {
  webp: 'image/webp',
  avif: 'image/avif',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

@Injectable()
export class ImageProcessor {
  private readonly defaultQuality: number;

  constructor(config: ConfigService) {
    this.defaultQuality =
      config.getOrThrow<AppConfig['defaultQuality']>('defaultQuality');
  }

  async transform(input: Buffer, query: ResizeQueryDto) {
    const quality = query.quality ?? this.defaultQuality;

    let pipeline = sharp(input).rotate();

    if (query.w || query.h) {
      pipeline = pipeline.resize({
        width: query.w,
        height: query.h,
        fit: query.fit ?? 'cover',
      });
    }

    const targetFormat = await this.resolveFormat(input, query.format);
    pipeline = this.applyFormat(pipeline, targetFormat, quality);
    const data = await pipeline.toBuffer();

    return { data, contentType: FORMAT_CONTENT_TYPE[targetFormat] };
  }

  private async resolveFormat(input: Buffer, requested?: Format) {
    if (requested) {
      return requested;
    }

    const { format } = await sharp(input).metadata();

    return FORMAT_VALUES.includes(format as Format)
      ? (format as Format)
      : 'webp';
  }

  private applyFormat(pipeline: sharp.Sharp, format: Format, quality: number) {
    switch (format) {
      case 'webp':
        return pipeline.webp({ quality });
      case 'avif':
        return pipeline.avif({ quality });
      case 'jpeg':
        return pipeline.jpeg({ quality });
      case 'png':
        return pipeline.png({ quality });
    }
  }
}
