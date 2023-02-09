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
  group_roles: GroupsRole[];

  @ManyToMany(() => Pick, (pick) => pick.group, { nullable: true })
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
