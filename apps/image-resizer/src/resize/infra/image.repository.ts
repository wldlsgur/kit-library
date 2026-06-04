import { BadRequestException, Injectable } from '@nestjs/common';
import type { ImagePayload } from '../image-payload';

/** 외부 URL에서 원본 이미지를 가져오는 책임만 가진다(인프라). */
@Injectable()
export class ImageRepository {
  async fetch(url: string): Promise<ImagePayload> {
    let res: globalThis.Response;
    try {
      res = await fetch(url);
    } catch {
      throw new BadRequestException('원본을 가져오지 못했습니다 (잘못된 url)');
    }
    if (!res.ok) {
      throw new BadRequestException(`원본을 가져오지 못했습니다: ${res.status}`);
    }
    const data = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
    return { data, contentType };
  }
}
