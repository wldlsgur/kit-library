import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { loadConfig } from './config/configuration';
import { ResizeModule } from './resize/resize.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [loadConfig],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 0,
      max: 500,
    }),
    ResizeModule,
  ],
})
export class AppModule {}
