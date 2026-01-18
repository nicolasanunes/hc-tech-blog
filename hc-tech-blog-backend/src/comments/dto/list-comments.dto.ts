import { ListCommentAuthorDto } from 'src/users/dto/list-user.dto';

export class ListCommentsDto {
  id: number;
  content: string;
  parentComment: ListCommentsDto | null;
  author: ListCommentAuthorDto;
  createdAt: Date;
}
