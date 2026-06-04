export const FIT_VALUES = ['cover', 'contain', 'fill', 'inside', 'outside'] as const;
export type Fit = (typeof FIT_VALUES)[number];

export const FORMAT_VALUES = ['webp', 'avif', 'jpeg', 'png'] as const;
export type Format = (typeof FORMAT_VALUES)[number];

function posInt(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

/**
 * 변환 옵션 값 객체. 쿼리 파싱·검증·정규화 규칙을 스스로 소유한다.
 * 이상한 값은 던지지 않고 무시(기본값 사용) — "원본 못 가져오는 경우만 에러" 정책에 맞춤.
 */
export class ResizeOptions {
  private constructor(
    readonly w: number | undefined,
    readonly h: number | undefined,
    readonly fit: Fit | undefined,
    readonly format: Format | undefined,
    readonly quality: number | undefined,
  ) {}

  static from(raw: Record<string, unknown>): ResizeOptions {
    const quality = posInt(raw.quality);
    return new ResizeOptions(
      posInt(raw.w),
      posInt(raw.h),
      FIT_VALUES.includes(raw.fit as Fit) ? (raw.fit as Fit) : undefined,
      FORMAT_VALUES.includes(raw.format as Format) ? (raw.format as Format) : undefined,
      quality && quality <= 100 ? quality : undefined,
    );
  }

  /** 리사이즈할 게 있는지(가로/세로 중 하나라도 지정). */
  hasResize(): boolean {
    return this.w !== undefined || this.h !== undefined;
  }

  qualityOr(fallback: number): number {
    return this.quality ?? fallback;
  }
}
