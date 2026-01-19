import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { ListCommentsDto } from './dto/list-comments.dto';
import { CreateCommentOnArticleDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create-comment-on-article')
  @UseGuards(AuthGuard('jwt'))
  async createCommentOnArticle(
    @Body() createCommentOnArticleDto: CreateCommentOnArticleDto,
    @Request() req: any,
  ): Promise<ListCommentsDto> {
    return this.commentsService.createCommentOnArticle(
      createCommentOnArticleDto,
      req.user.id,
    );
  }
}
