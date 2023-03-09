import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
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

  /**
   * This function creates a comment and saves it to the database
   * @param {User} user - User - the user who is creating the comment
   * @param {string} pid - The id of the pick that the comment is being made on.
   * @param {string} content - the content of the comment.
   * @returns A comment
   */
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

  /**
   * This function takes a pick id as a parameter and returns an array of comments that are associated
   * with that pick
   * @param {string} pid - string
   * @returns An array of comments
   */
  async getCommetsByPick(pid: string): Promise<Comment[]> {
    const comments: Comment[] = await this.commentRepo
      .createQueryBuilder('comment')
      .where('pickId = :pid', { pid: pid })
      .getMany();

    return comments;
  }

  /**
   * Get all comments for a given user.
   * @param {User} user - User - the user object that we're passing in
   * @returns An array of comments
   */
  async getCommentsByUser(user: User): Promise<Comment[]> {
    const comments: Comment[] = await this.commentRepo
      .createQueryBuilder('comment')
      .where('userId = :uid', { uid: user.id })
      .getMany();

    return comments;
  }

  /**
   * It takes an id as a parameter, finds a comment with that id, and returns it
   * @param {string} id - string - The id of the comment we want to retrieve.
   * @returns A comment
   */
  async getCommentById(id: string): Promise<Comment> {
    const comment: Comment = await this.commentRepo.findOneBy({ id });
    if (!comment) {
      this.logger.error('Comment not found');
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
}
