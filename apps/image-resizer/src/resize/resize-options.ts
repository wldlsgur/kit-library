export const FIT_VALUES = ['cover', 'contain', 'fill', 'inside', 'outside'] as const;
export type Fit = (typeof FIT_VALUES)[number];

export const FORMAT_VALUES = ['webp', 'avif', 'jpeg', 'png'] as const;
export type Format = (typeof FORMAT_VALUES)[number];

export interface ResizeOptions {
  w?: number;
  h?: number;
  fit?: Fit;
  format?: Format;
  quality?: number;
}

function posInt(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

/** 쿼리스트링을 관대하게 파싱한다. 이상한 값은 던지지 않고 그냥 무시(기본값 사용). */
export function parseResizeOptions(raw: Record<string, unknown>): ResizeOptions {
  const fit = FIT_VALUES.includes(raw.fit as Fit) ? (raw.fit as Fit) : undefined;
  const format = FORMAT_VALUES.includes(raw.format as Format)
    ? (raw.format as Format)
    : undefined;
  const quality = posInt(raw.quality);

  return {
    w: posInt(raw.w),
    h: posInt(raw.h),
    fit,
    format,
    quality: quality && quality <= 100 ? quality : undefined,
  };
}
