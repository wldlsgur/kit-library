import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { AppConfig } from './config/configuration';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors(); // 브라우저에서 fetch로 용량 측정 등 교차 출처 호출 허용
  app.enableShutdownHooks();

  const config = app.get(ConfigService);
  const port = config.get<AppConfig['port']>('port') ?? 8080;
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`image-resizer listening on http://0.0.0.0:${port}`);
}

void bootstrap();
