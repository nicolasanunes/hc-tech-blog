import { ListTagsDto } from 'src/tags/dto/list-tags.dto';
import { ListAuthorDto } from 'src/users/dto/list-user.dto';

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
