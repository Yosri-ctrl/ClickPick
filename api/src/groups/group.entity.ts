import { Pick } from 'src/pick/pick.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupsRole } from './groupsRole/groupsRole.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  type: groupTypes;

  @OneToMany(() => GroupsRole, (role) => role.group_id)
  users: GroupsRole[];

  @OneToMany(() => Pick, (pick) => pick.group, { eager: true })
  pick: Pick[];

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
