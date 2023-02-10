import { Pick } from 'src/pick/pick.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Group } from '../group.entity';

@Entity()
export class GroupsPick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (group) => group.picks)
  group_id: Group;

  @ManyToOne(() => Pick, (pick) => pick.group)
  pick_id: Pick;
}
