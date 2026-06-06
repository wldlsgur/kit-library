import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { AppConfig } from './config/configuration';

declare const module: NodeModule & {
  hot?: {
    accept: () => void;
    dispose: (callback: () => void) => void;
  };
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableShutdownHooks();

  const config = app.get(ConfigService);
  const port = config.getOrThrow<AppConfig['port']>('port');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => void app.close());
  }

  await app.listen(port, '0.0.0.0');

  console.log(`Server listening on ${port}`);
}

void bootstrap();
