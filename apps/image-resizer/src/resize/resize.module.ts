import { Module } from '@nestjs/common';
import { ResizeController } from './resize.controller';
import { ResizeService } from './resize.service';

@Module({
  controllers: [ResizeController],
  providers: [ResizeService],
})
export class ResizeModule {}
