import { Exclude } from 'class-transformer';
import { Comment } from 'src/comments/comment.entity';
import { GroupsRole } from 'src/groups/groupsRole/groupsRole.entity';
import { Pick } from 'src/pick/pick.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => Pick, (pick) => pick.user, { eager: true })
  pick: Pick[];

  @OneToMany(() => GroupsRole, (role) => role.user_id)
  group_roles: GroupsRole[];

  @ManyToMany(() => User, (user) => user.following)
  @Exclude({ toPlainOnly: true })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable()
  following: User[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  // @Column({ nullable: true })
  // img: string;

  // @Column()
  // birth_date: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Exclude({ toPlainOnly: true })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Exclude({ toPlainOnly: true })
  updated_at: Date;
}
