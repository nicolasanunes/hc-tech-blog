import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Article } from './entities/article.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Tag } from '../tags/entities/tag.entity';
import { SearchArticlesDto } from './dto/search-articles.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ArticleWithComments,
  ListArticleDto,
  ListArticlesDto,
  PaginatedArticlesDto,
} from './dto/list-articles.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createArticle(
    createArticleDto: CreateArticleDto,
    authorId: number,
  ): Promise<ListArticlesDto> {
    const { title, content, articlePicture, tagIds } = createArticleDto;

    // Valida se as tags existem
    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagRepository.find({
        where: { id: In(tagIds) },
      });

      if (tags.length !== tagIds.length) {
        throw new BadRequestException('Uma ou mais tags não foram encontradas');
      }
    }

    // Cria o artigo
    const newArticle = this.articleRepository.create({
      title,
      content,
      articlePicture,
      authorId,
    });

    const savedArticle = await this.articleRepository.save(newArticle);

    // Associa as tags
    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagRepository.find({
        where: { id: In(tagIds) },
      });
      savedArticle.tags = tags;
      await this.articleRepository.save(savedArticle);
    }

    // Retorna o artigo com todas as relações
    const articleWithRelations = await this.articleRepository.findOne({
      where: { id: savedArticle.id },
      relations: ['author', 'tags'],
    });

    if (!articleWithRelations) {
      throw new NotFoundException('Erro ao criar o artigo');
    }

    return {
      id: articleWithRelations.id,
      title: articleWithRelations.title,
      content: articleWithRelations.content,
      articlePicture: articleWithRelations.articlePicture,
      createdAt: articleWithRelations.createdAt,
      author: {
        id: articleWithRelations.author.id,
        name: articleWithRelations.author.name,
      },
      tags: articleWithRelations.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  }

  async listArticleById(id: number): Promise<ListArticleDto> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!article) {
      throw new NotFoundException('Artigo não encontrado');
    }

    return {
      id: article.id,
      title: article.title,
      content: article.content,
      articlePicture: article.articlePicture,
      tags: article.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  }

  async searchArticles(
    searchArticlesDto: SearchArticlesDto,
  ): Promise<PaginatedArticlesDto> {
    const { title, tagIds, page = 1, limit = 5 } = searchArticlesDto;

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

  async listArticleWithComments(id: number): Promise<ArticleWithComments> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author', 'tags'],
    });

    if (!article) {
      throw new Error('Artigo não encontrado');
    }

    const comments = await this.commentsRepository.find({
      where: { article: { id: article.id } },
      relations: ['author', 'parentComment'],
      order: { createdAt: 'DESC' },
    });

    return {
      article: {
        id: article.id,
        title: article.title,
        content: article.content,
        articlePicture: article.articlePicture,
        author: {
          id: article.author.id,
          name: article.author.name,
        },
        tags: article.tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
        })),
        createdAt: article.createdAt,
      },
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        parentComment: comment.parentComment,
        author: {
          id: comment.author.id,
          name: comment.author.name,
          profilePicture: comment.author.profilePicture,
        },
      })),
    };
  }

  async updateArticle(
    id: number,
    updateArticleDto: UpdateArticleDto,
    userId: number,
  ): Promise<ListArticlesDto> {
    // Busca o artigo
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author', 'tags'],
    });

    if (!article) {
      throw new NotFoundException('Artigo não encontrado');
    }

    // Verifica se o usuário é o autor do artigo
    if (article.authorId !== userId) {
      throw new BadRequestException(
        'Você não tem permissão para editar este artigo',
      );
    }

    const { title, content, articlePicture, tagIds } = updateArticleDto;

    // Atualiza os campos e != de undefined
    if (title !== undefined) article.title = title;
    if (content !== undefined) article.content = content;
    if (articlePicture !== undefined) article.articlePicture = articlePicture;

    // Atualiza as tags
    if (tagIds !== undefined) {
      if (tagIds.length > 0) {
        const tags = await this.tagRepository.find({
          where: { id: In(tagIds) },
        });

        if (tags.length !== tagIds.length) {
          throw new BadRequestException(
            'Uma ou mais tags não foram encontradas',
          );
        }

        article.tags = tags;
      } else {
        article.tags = [];
      }
    }

    // Salva as alterações no banco de dados
    await this.articleRepository.save(article);

    // Retorna o artigo atualizado com todas as relações
    const updatedArticle = await this.articleRepository.findOne({
      where: { id },
      relations: ['author', 'tags'],
    });

    if (!updatedArticle) {
      throw new NotFoundException('Erro ao atualizar o artigo');
    }

    return {
      id: updatedArticle.id,
      title: updatedArticle.title,
      content: updatedArticle.content,
      articlePicture: updatedArticle.articlePicture,
      createdAt: updatedArticle.createdAt,
      author: {
        id: updatedArticle.author.id,
        name: updatedArticle.author.name,
      },
      tags: updatedArticle.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  }
}
