import { Module } from '@nestjs/common';
import { ImageProcessor } from './infra/image-processor';
import { ImageRepository } from './infra/image.repository';
import { ResizeController } from './resize.controller';
import { ResizeService } from './resize.service';

@Module({
  controllers: [ResizeController],
  providers: [ResizeService, ImageRepository, ImageProcessor],
})
export class ResizeModule {}
