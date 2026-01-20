import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
  ListArticleDto,
  ListArticlesDto,
  PaginatedArticlesDto,
} from './dto/list-articles.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: any,
  ): Promise<ListArticleDto> {
    return this.articlesService.createArticle(createArticleDto, req.user.id);
  }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  async searchArticles(
    @Query() searchArticlesDto: SearchArticlesDto,
  ): Promise<PaginatedArticlesDto> {
    return this.articlesService.searchArticles(searchArticlesDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async listArticleById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ListArticleDto> {
    return this.articlesService.listArticleById(id);
  }

  @Get(':id/article-with-comments')
  @UseGuards(AuthGuard('jwt'))
  async listArticleWithComments(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleWithComments> {
    return this.articlesService.listArticleWithComments(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req: any,
  ): Promise<ListArticlesDto> {
    return this.articlesService.updateArticle(
      id,
      updateArticleDto,
      req.user.id,
    );
  }
}
