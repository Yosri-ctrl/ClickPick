import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Pick } from 'src/pick/pick.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pick, (pick) => pick.comment, { eager: false })
  @Exclude({ toPlainOnly: true })
  pick: Pick;

  @ManyToOne(() => User, (user) => user.comment)
  @Exclude({ toPlainOnly: true })
  user: User;

  @Column()
  content: string;

  @Column({ default: 0 })
  like: number;
}
