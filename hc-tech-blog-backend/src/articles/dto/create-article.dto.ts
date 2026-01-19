import { IsString, IsNotEmpty, IsArray, IsOptional } from '@nestjs/class-validator';
 
export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  articlePicture: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  tagIds: number[];
}