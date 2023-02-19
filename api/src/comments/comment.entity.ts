import { User } from 'src/auth/user.entity';
import { Pick } from 'src/pick/pick.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pick: Pick;

  @Column()
  user: User;

  @Column()
  content: string;

  @Column()
  like: number;
}
