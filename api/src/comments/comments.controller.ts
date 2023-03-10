import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
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

  @Get(':id/pick')
  getCommentByPick(@Param('id') id: string): Promise<Comment[]> {
    return this.commentService.getCommetsByPick(id);
  }

  @Get('/user')
  getCommentsByUser(@GetUser() user: User): Promise<Comment[]> {
    return this.commentService.getCommentsByUser(user);
  }

  @Get(':id')
  getCommentById(@Param('id') id: string): Promise<Comment> {
    return this.commentService.getCommentById(id);
  }

  @Put(':id')
  updateCommentContent(
    @Param('id') id: string,
    @Body('content') content: string,
  ): Promise<Comment> {
    return this.commentService.updateCommentContent(id, content);
  }
}
