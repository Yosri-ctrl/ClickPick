import { User } from 'src/auth/user.entity';
import { Pick } from 'src/pick/pick.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pick, (pick) => pick.comment, { eager: false })
  pick: Pick;

  @ManyToOne(() => User, (user) => user.comment)
  user: User;

  @Column()
  content: string;

  @Column({default: 0})
  like: number;
}
