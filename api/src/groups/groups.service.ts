import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group, groupTypes } from './group.entity';
import { GroupsRole, roleType } from './groupsRole/groupsRole.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  private logger = new Logger('Groups service');

  async createGroup(
    createGroupDto: CreateGroupDto,
    user: User,
  ): Promise<Group> {
    const { title, description } = createGroupDto;
    const group: Group = this.groupRepository.create({
      title,
      description,
      type: groupTypes.public,
    });
    await this.groupRepository.save(group);

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(GroupsRole)
      .values([{ group_id: group, user_id: user, role: roleType.owner }])
      .execute();

    return group;
  }
}
