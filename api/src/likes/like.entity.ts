import { User } from 'src/auth/user.entity';
import { Comment } from 'src/comments/comment.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id)
  user: User;

  @OneToOne(() => Comment, (comment) => comment.id)
  comment: Comment;

  @Column()
  emoji: string;
}
