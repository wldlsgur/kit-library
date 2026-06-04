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

CMD ["node", "dist/main.js"]
