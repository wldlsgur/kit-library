export interface AppConfig {
  port: number;
  defaultQuality: number;
  cacheMaxAge: number;
}

function int(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export function loadConfig(): AppConfig {
  return {
    port: int(process.env.PORT, 8080),
    defaultQuality: Math.min(100, int(process.env.DEFAULT_QUALITY, 80)),
    cacheMaxAge: int(process.env.CACHE_MAX_AGE, 86_400),
  };
}
