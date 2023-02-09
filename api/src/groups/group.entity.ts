import { User } from 'src/auth/user.entity';
import { Pick } from 'src/pick/pick.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Groups {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column()
  Decriptin: string;

  @Column()
  type: groupTypes;

  @ManyToMany(() => User, (user) => user.groups, { nullable: true })
  @JoinTable()
  users: User[];

  @ManyToMany(() => Pick)
  @JoinTable()
  picks: Pick[];

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

export enum groupTypes {
  privat = 'PRIVATE',
  public = 'PUBLIC',
}
