import { User } from 'src/auth/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Pick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column()
  // user: User;

  @Column()
  content: string;

  @Column({ default: 0 })
  like: number;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne((_type) => User, (user) => user.pick, { eager: false })
  user: User;

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
