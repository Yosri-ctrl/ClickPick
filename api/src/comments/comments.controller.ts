import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';

@Controller('comments')
@UseGuards(AuthGuard())
export class CommentsController {
  constructor(private commentService: CommentsService) {}
  private logger = new Logger('Comments Service');

  @Post(':id/')
  createComment(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body('content') content: string,
  ): Promise<Comment> {
    return this.commentService.createComment(user, id, content);
  }

  @Get(':id/')
  getCommentByPick(@Param('id') id: string): Promise<Comment[]> {
    return this.commentService.getCommetsByPick(id);
  }

  @Get()
  getCommentsByUser(@GetUser() user: User): Promise<Comment[]> {
    return this.commentService.getCommentsByUser(user);
  }
}
