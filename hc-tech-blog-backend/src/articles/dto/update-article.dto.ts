import { IsString, IsArray, IsOptional } from '@nestjs/class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  articlePicture?: string;

  @IsArray()
  @IsOptional()
  tagIds?: number[];
}
