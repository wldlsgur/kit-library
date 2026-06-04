# syntax=docker/dockerfile:1

# 이 app만 독립 빌드한다. 빌드 컨텍스트 = apps/image-resizer
# (모노레포 루트가 아니라 이 디렉토리에서 docker build .)

# --- Stage 1: build ---
FROM node:22-slim AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN npm run build

# --- Stage 2: runtime ---
FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

ENV PORT=8080
EXPOSE 8080
USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/main.js"]
