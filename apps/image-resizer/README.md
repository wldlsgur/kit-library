# image-resizer

A lightweight NestJS server that resizes, reformats, and adjusts quality of images on the fly. Provide a source image URL and desired options via query parameters, and get back the transformed image.

## API

### `GET /`

| Parameter | Required | Description | Default |
|---|---|---|---|
| `url` | Yes | Source image URL | — |
| `w` | No | Target width in px | — |
| `h` | No | Target height in px | — |
| `fit` | No | `cover` \| `contain` \| `fill` \| `inside` \| `outside` | `cover` |
| `format` | No | `webp` \| `avif` \| `jpeg` \| `png` | Original format |
| `quality` | No | 1–100 | `80` |

- If neither `w` nor `h` is provided, the original image is returned as-is.
- If only `w` or `h` is given, the other dimension is calculated automatically to preserve the aspect ratio.
- Responses include `Content-Type` and `Cache-Control` headers.
- Repeated requests with the same parameters are served from an in-memory cache.

**Usage with `<img>` tag:**

```html
<img src="http://localhost:8080/?url=https://cdn.example.com/photo.jpg&w=400&format=webp" />
```

**Usage with curl:**

```bash
curl 'http://localhost:8080/?url=https://cdn.example.com/photo.jpg&w=300&format=webp' -o out.webp
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | Server port |
| `DEFAULT_QUALITY` | `80` | Default image quality (1–100) |
| `CACHE_MAX_AGE` | `86400` | `Cache-Control` max-age in seconds |
| `ALLOWED_PREFIXES` | — | Comma-separated list of allowed source URL prefixes (required) |

`ALLOWED_PREFIXES` controls which source URLs are permitted. Requests for URLs not matching any prefix return 404. The `http://` / `https://` scheme is stripped automatically, so `cdn.example.com` and `https://cdn.example.com` are equivalent.

```env
ALLOWED_PREFIXES=cdn.example.com,img.example.com/uploads
```

## Local Development

```bash
pnpm install
pnpm --filter image-resizer start:dev
```

## Docker

```bash
cd apps/image-resizer
docker build -t image-resizer .
docker run --rm -p 8080:8080 -e ALLOWED_PREFIXES=cdn.example.com image-resizer
```
