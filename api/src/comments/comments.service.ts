import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Pick } from 'src/pick/pick.entity';
import { PickService } from 'src/pick/pick.service';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    // @InjectRepository(Pick)
    // private pickRepo: Repository<Pick>,
    private pickService: PickService,
  ) {}
  private logger = new Logger('Comment Service');

  async createComment(
    user: User,
    pid: string,
    content: string,
  ): Promise<Comment> {
    const pick: Pick = await this.pickService.getPickById(pid);
    console.log(user);
    const comment: Comment = await this.commentRepo.create({
      user,
      pick,
      content,
    });

    await this.commentRepo.save(comment);
    return comment;
  }
}
