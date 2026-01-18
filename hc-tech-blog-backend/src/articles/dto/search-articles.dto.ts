import { Type } from '@nestjs/class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from '@nestjs/class-validator';

export class SearchArticlesDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  tagIds?: number[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 6;
}
