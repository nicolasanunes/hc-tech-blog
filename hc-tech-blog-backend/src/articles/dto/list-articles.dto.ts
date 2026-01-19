import { ListCommentsDto } from 'src/comments/dto/list-comments.dto';
import { ListTagsDto } from 'src/tags/dto/list-tags.dto';
import { ListAuthorDto } from 'src/users/dto/list-user.dto';

export class ListArticleDto {
  id: number;
  title: string;
  content: string;
  articlePicture: string;
  tags: ListTagsDto[];
} 

export class ListArticlesDto {
  id: number;
  title: string;
  content: string;
  articlePicture: string;
  author: ListAuthorDto;
  createdAt: Date;
  tags: ListTagsDto[];
}

export class PaginatedArticlesDto {
  data: ListArticlesDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ArticleWithComments {
  article: ListArticlesDto;
  comments: ListCommentsDto[];
}
