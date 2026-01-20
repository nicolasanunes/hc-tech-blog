import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Article } from '../articles/entities/article.entity';
import { Repository } from 'typeorm';
import { ListCommentsDto } from './dto/list-comments.dto';
import { CreateCommentOnArticleDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {} 

  async createCommentOnArticle(
    comment: CreateCommentOnArticleDto,
    authorId: number,
  ): Promise<ListCommentsDto> {
    // Valida se o artigo existe
    const article = await this.articleRepository.findOne({
      where: { id: comment.articleId },
    });

    if (!article) {
      throw new NotFoundException('Artigo não encontrado');
    }

    // Valida se o parentComment existe e pertence ao mesmo artigo
    if (comment.parentCommentId) {
      const parentComment = await this.commentsRepository.findOne({
        where: { id: comment.parentCommentId },
        select: ['id', 'articleId'],
      }); 

      if (!parentComment) {
        throw new NotFoundException('O comentário pai não foi encontrado');
      } 

      if (Number(parentComment.articleId) !== Number(comment.articleId)) {
        throw new BadRequestException(
          'o comentário pai não pertence ao mesmo artigo',
        );
      }
    }

    const newComment = this.commentsRepository.create({
      content: comment.content,
      articleId: comment.articleId,
      authorId: authorId,
      parentCommentId: comment.parentCommentId || undefined,
    });

    const savedComment = await this.commentsRepository.save(newComment);

    const commentWithRelations = await this.commentsRepository.findOne({
      where: { id: savedComment.id },
      relations: ['author', 'parentComment', 'parentComment.author'],
    });

    if (!commentWithRelations) {
      throw new NotFoundException('Houve um erro na criação do comentário');
    }

    return {
      id: commentWithRelations.id,
      content: commentWithRelations.content,
      createdAt: commentWithRelations.createdAt,
      author: {
        id: commentWithRelations.author.id,
        name: commentWithRelations.author.name,
        profilePicture: commentWithRelations.author.profilePicture,
      },
      parentComment: commentWithRelations.parentComment
        ? {
            id: commentWithRelations.parentComment.id,
            content: commentWithRelations.parentComment.content,
            createdAt: commentWithRelations.parentComment.createdAt,
            author: {
              id: commentWithRelations.parentComment.author.id,
              name: commentWithRelations.parentComment.author.name,
              profilePicture:
                commentWithRelations.parentComment.author.profilePicture,
            },
            parentComment: null,
          }
        : null,
    };
  }

  async deleteComment(commentId: number, authorId: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado');
    }

    if (comment.authorId !== authorId) {
      throw new BadRequestException(
        'Você não tem permissão para deletar este comentário',
      );
    }

    // Deletar recursivamente todos os comentários filhos
    await this.deleteCommentAndChildren(commentId);
  }
 
  private async deleteCommentAndChildren(commentId: number): Promise<void> {
    // Buscar todos os comentários filhos
    const childComments = await this.commentsRepository.find({
      where: { parentCommentId: commentId },
    });

    // Deletar recursivamente cada comentário filho
    for (const child of childComments) {
      await this.deleteCommentAndChildren(child.id);
    }

    // Deletar o comentário atual
    await this.commentsRepository.delete({ id: commentId });
  }
}
 