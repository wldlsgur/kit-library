import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { type Format, FORMAT_VALUES, ResizeOptions } from '../domain/resize-options';
import type { ImagePayload } from '../image-payload';

const FORMAT_CONTENT_TYPE: Record<Format, string> = {
  webp: 'image/webp',
  avif: 'image/avif',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

/** sharp 기반 이미지 변환(인프라). 리사이즈/포맷/품질 적용. */
@Injectable()
export class ImageProcessor {
  async transform(
    input: Buffer,
    options: ResizeOptions,
    defaultQuality: number,
  ): Promise<ImagePayload> {
    const quality = options.qualityOr(defaultQuality);

    let pipeline = sharp(input).rotate(); // EXIF 방향 자동 보정

    if (options.hasResize()) {
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
    return FORMAT_VALUES.includes(format as Format) ? (format as Format) : 'webp';
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
