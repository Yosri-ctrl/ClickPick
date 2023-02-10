import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group, groupTypes } from './group.entity';
import { GroupsRole, roleType } from './groupsRole/groupsRole.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupsRole)
    private readonly groupRoleRepository: Repository<GroupsRole>,
  ) {}
  private logger = new Logger('Groups service');

  async createGroup(
    createGroupDto: CreateGroupDto,
    user: User,
  ): Promise<Group> {
    const { title, description } = createGroupDto;

    // title already exists
    const group: Group = this.groupRepository.create({
      title,
      description,
      type: groupTypes.public,
    });
    await this.groupRepository.save(group);

    const role: GroupsRole = this.groupRoleRepository.create({
      group_id: group,
      user_id: user,
      role: roleType.owner,
    });
    await this.groupRoleRepository.save(role);

    return group;
  }
}
