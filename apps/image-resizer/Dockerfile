FROM node:22-alpine AS base
RUN npm install -g pnpm@8.15.6 turbo
WORKDIR /repo

FROM base AS pruner
COPY . .
RUN turbo prune image-resizer --docker

FROM base AS builder
COPY --from=pruner /repo/out/json/ ./
COPY turbo.json ./
RUN pnpm install --frozen-lockfile
COPY --from=pruner /repo/out/full/ ./
RUN pnpm --filter=image-resizer build

FROM node:22-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production

COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/package.json /repo/pnpm-lock.yaml /repo/pnpm-workspace.yaml ./
COPY --from=builder /repo/apps/image-resizer/package.json ./apps/image-resizer/
COPY --from=builder /repo/apps/image-resizer/dist ./apps/image-resizer/dist
COPY --from=builder /repo/apps/image-resizer/node_modules ./apps/image-resizer/node_modules

WORKDIR /repo/apps/image-resizer

ENV PORT=8080
ENV DEFAULT_QUALITY=80
ENV CACHE_MAX_AGE=86400
ENV ALLOWED_PREFIXES=localhost:5173

EXPOSE 8080
CMD ["node", "dist/main.js"]
