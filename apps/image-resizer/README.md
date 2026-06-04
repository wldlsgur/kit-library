# image-resizer

URL로 받은 원본 이미지를 **리사이즈 + 포맷 변환 + 품질 조절**해서 돌려주는 작은 NestJS 서버.
도커 한 줄로 띄워 필요할 때 바로 쓰는 온디맨드 용도.

## API

### `GET /resize`
| 파라미터 | 필수 | 설명 | 기본값 |
|---|---|---|---|
| `url` | ✅ | 원본 이미지 주소 (http/https) | — |
| `w` | △ | 목표 가로 px (`w`/`h` 중 최소 하나 필수) | — |
| `h` | △ | 목표 세로 px | — |
| `fit` | | `cover` \| `contain` \| `fill` \| `inside` \| `outside` | `cover` |
| `format` | | `webp` \| `avif` \| `jpeg` \| `png` | 원본 포맷 유지 |
| `quality` | | 1~100 | `80` (`DEFAULT_QUALITY`) |

응답은 변환된 이미지 바이트(`Content-Type`/`Cache-Control` 포함).

예시:
```bash
curl 'http://localhost:8080/resize?url=https://example.com/photo.jpg&w=300&format=webp&quality=80' \
  --output out.webp
```
`<img>`에 직접:
```html
<img src="http://localhost:8080/resize?url=https://example.com/photo.jpg&w=400&format=webp" />
```

### `GET /health`
`{ "status": "ok" }` (도커 HEALTHCHECK용).

## 환경변수
`.env.example` 참고. 전부 기본값이 있어 무설정 실행 가능.

| 변수 | 기본값 | 설명 |
|---|---|---|
| `PORT` | `8080` | 서버 포트 |
| `DEFAULT_QUALITY` | `80` | format 변환 기본 품질 |
| `CACHE_MAX_AGE` | `86400` | 응답 `Cache-Control` max-age(초) |

> ⚠️ **노출 주의**: `url`을 받아 서버가 직접 fetch하므로 SSRF 방어가 없다(신뢰된 호출자/URL 전제).
> 외부에 공개한다면 신뢰 호스트만 허용하는 화이트리스트나 인증을 앞단에 두는 것을 권장.

## 로컬 실행
```bash
pnpm install
pnpm --filter image-resizer start:dev   # http://localhost:8080
```

## 도커 실행
```bash
cd apps/image-resizer

# 단독
docker build -t image-resizer .
docker run --rm -p 8080:8080 image-resizer

# 또는 compose
docker compose up --build
```
