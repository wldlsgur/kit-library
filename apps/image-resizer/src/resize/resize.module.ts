import { Module } from '@nestjs/common';
import { ImageProcessor } from './infra/image-processor';
import { ResizeController } from './resize.controller';
import { ResizeService } from './resize.service';

@Module({
  controllers: [ResizeController],
  providers: [ResizeService, ImageProcessor],
})
export class ResizeModule {}
