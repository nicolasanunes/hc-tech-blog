import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { SearchArticlesDto } from './dto/search-articles.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ArticleWithComments,
  ListArticlesDto,
  PaginatedArticlesDto,
} from './dto/list-articles.dto';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: any,
  ): Promise<ListArticlesDto> {
    return this.articlesService.createArticle(createArticleDto, req.user.id);
  }

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
