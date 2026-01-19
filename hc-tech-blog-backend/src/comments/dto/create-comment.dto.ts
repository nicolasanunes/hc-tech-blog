import { Type } from '@nestjs/class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

export class CreateCommentOnArticleDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  articleId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parentCommentId?: number;
}
