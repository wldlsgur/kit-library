import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ResizeQueryDto } from './dto/resize-query.dto';
import { AllowedUrlGuard } from './guard/allowed-url.guard';
import { ImageResponseInterceptor } from './interceptor/image-response.interceptor';
import { ResizeService } from './resize.service';

@Controller('')
export class ResizeController {
  constructor(private readonly resizer: ResizeService) {}

  @Get()
  @UseGuards(AllowedUrlGuard)
  @UseInterceptors(ImageResponseInterceptor, CacheInterceptor)
  async resize(@Query() query: ResizeQueryDto) {
    return this.resizer.process(query);
  }
}
