import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { SearchArticlesDto } from './dto/search-articles.dto';
import { PaginatedArticlesDto } from './dto/list-articles.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async searchArticles(
    searchArticlesDto: SearchArticlesDto,
  ): Promise<PaginatedArticlesDto> {
    const { title, tagIds, page = 1, limit = 6 } = searchArticlesDto;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags');

    // Filtro por título
    if (title) {
      queryBuilder.andWhere('article.title LIKE :title', {
        title: `%${title}%`,
      });
    }

    // Filtro por ID de Tags
    if (tagIds && tagIds.length > 0) {
      const tagIdsArray = Array.isArray(tagIds) ? tagIds : [tagIds];

      queryBuilder
        .innerJoin('article.tags', 'filterTags')
        .andWhere('filterTags.id IN (:...tagIds)', { tagIds: tagIdsArray });
    }

    // Retorno em ordem por mais recente
    queryBuilder.orderBy('article.createdAt', 'DESC');

    const total = await queryBuilder.getCount();

    // Aplica a paginação
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const articles = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: articles.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        articlePicture: article.articlePicture,
        createdAt: article.createdAt,
        author: {
          id: article.author.id,
          name: article.author.name,
        },
        tags: article.tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
        })),
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }
}
