import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Comment } from 'src/comments/comment.entity';
import { Group } from 'src/groups/group.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Pick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  // @Column({ default: 0 })
  // like: number;

  @OneToMany(() => Comment, (comment) => comment.pick, { nullable: true, eager: false })
  comment: Comment[];

  @ManyToOne(() => User, (user) => user.pick, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  @ManyToOne(() => Group, (group) => group.pick, { eager: false })
  @Exclude({ toPlainOnly: true })
  group: Group;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
