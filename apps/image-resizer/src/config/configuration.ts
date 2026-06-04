export interface AppConfig {
  port: number;
  defaultQuality: number;
  cacheMaxAge: number;
  /** 허용 출처 prefix 목록(scheme 무시, host+path 기준). 비어있으면 모든 출처 허용. */
  allowedPrefixes: string[];
}

function int(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

/** prefix를 정규화: 앞뒤 공백 제거, 소문자화, http(s):// 접두어 제거. */
function normalizePrefix(p: string): string {
  return p.trim().toLowerCase().replace(/^https?:\/\//, '');
}

export function loadConfig(): AppConfig {
  return {
    port: int(process.env.PORT, 8080),
    defaultQuality: Math.min(100, int(process.env.DEFAULT_QUALITY, 80)),
    cacheMaxAge: int(process.env.CACHE_MAX_AGE, 86_400),
    allowedPrefixes: (process.env.ALLOWED_PREFIXES ?? '')
      .split(',')
      .map(normalizePrefix)
      .filter(Boolean),
  };
}
