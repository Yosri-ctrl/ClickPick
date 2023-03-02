import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
  ) {}
  private logger = new Logger('Comment Service');

  async createComment(): Promise<Comment> {
    const comment: Comment = await this.commentRepo.create({});

    return comment;
  }
}
