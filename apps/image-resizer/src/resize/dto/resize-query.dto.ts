import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export const FIT_VALUES = [
  'cover',
  'contain',
  'fill',
  'inside',
  'outside',
] as const;

export type Fit = (typeof FIT_VALUES)[number];

export const FORMAT_VALUES = ['webp', 'avif', 'jpeg', 'png'] as const;
export type Format = (typeof FORMAT_VALUES)[number];

export class ResizeQueryDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  w?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  h?: number;

  @IsOptional()
  @IsIn([...FIT_VALUES])
  fit?: Fit;

  @IsOptional()
  @IsIn([...FORMAT_VALUES])
  format?: Format;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  quality?: number;
}
