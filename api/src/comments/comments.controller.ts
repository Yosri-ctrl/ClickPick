import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}
  private logger = new Logger('Comments Service');

  @Post()
  createComment(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body('content') content: string,
  ): Promise<Comment> {
    return this.commentService.createComment(user, id, content);
  }
}
