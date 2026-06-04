import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loadConfig } from './config/configuration';
import { HealthController } from './health/health.controller';
import { ResizeModule } from './resize/resize.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [loadConfig],
    }),
    ResizeModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
