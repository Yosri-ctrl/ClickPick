import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Group } from '../group.entity';

@Entity()
export class GroupsRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user_id) => user_id.group_roles, { eager: true })
  user_id: User;

  @ManyToOne(() => Group, (group_id) => group_id.users, { eager: true })
  group_id: Group;

  @Column()
  role: roleType;
}

export enum roleType {
  owner = 'OWNER',
  admin = 'ADMIN',
  user = 'USER',
}
