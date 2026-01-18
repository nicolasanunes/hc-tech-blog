import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { SearchArticlesDto } from './dto/search-articles.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ArticleWithComments,
  PaginatedArticlesDto,
} from './dto/list-articles.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  async searchArticles(
    @Query() searchArticlesDto: SearchArticlesDto,
  ): Promise<PaginatedArticlesDto> {
    return this.articlesService.searchArticles(searchArticlesDto);
  }

  @Get(':id/article-with-comments')
  @UseGuards(AuthGuard('jwt'))
  async listArticleWithComments(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleWithComments> {
    return this.articlesService.listArticleWithComments(id);
  }
}
