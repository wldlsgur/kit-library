import { BadRequestException, ForbiddenException } from '@nestjs/common';

/**
 * 원본 이미지 출처 값 객체. url 파싱 + http/https 제약 + 허용 prefix 정책을
 * 스스로 검증한다. 검증을 통과한 것만 인스턴스로 존재할 수 있다(불변식).
 */
export class ImageSource {
  private constructor(readonly url: string) {}

  static from(rawUrl: string, allowedPrefixes: string[]): ImageSource {
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      throw new BadRequestException('잘못된 url');
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new BadRequestException('http/https url만 허용됩니다');
    }

    if (allowedPrefixes.length > 0) {
      // raw 문자열이 아닌 파싱된 host+path로 검사 → @ 우회 차단
      const target = `${parsed.host}${parsed.pathname}`.toLowerCase();
      if (!allowedPrefixes.some((p) => target.startsWith(p))) {
        throw new ForbiddenException('허용되지 않은 이미지 출처입니다');
      }
    }

    return new ImageSource(parsed.href);
  }
}
