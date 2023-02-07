import { Exclude } from 'class-transformer';
import { Pick } from 'src/pick/pick.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationCount,
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
  @Exclude({ toPlainOnly: true })
  pick: Pick[];

  // @Column({ type: 'text', array: true, default: [] })
  // @Exclude({ toPlainOnly: true })
  // followers: string[];

  // @Column({ type: 'text', array: true, default: [] })
  // @Exclude({ toPlainOnly: true })
  // following: string[];

  @ManyToMany(() => User, (user) => user.following)
  @Exclude({ toPlainOnly: true })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  @Exclude({ toPlainOnly: true })
  @JoinTable()
  following: User[];

  // @Column({ nullable: true })
  // groups: Group[];

  // @Column({ nullable: true })
  // img: string;

  // @Column()
  // birth_date: Date;
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
