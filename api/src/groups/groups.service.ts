import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

    let group: Group = await this.groupRepository.findOneBy({ title });
    if (group) {
      this.logger.error(`Group with title: '${title}' already exists`, '');
      throw new ConflictException(
        `Group with title: '${title}' already exists`,
      );
    } else {
      group = this.groupRepository.create({
        title,
        description,
        type: groupTypes.public,
      });
    }
    await this.groupRepository.save(group);

    const role: GroupsRole = this.groupRoleRepository.create({
      group_id: group,
      user_id: user,
      role: roleType.owner,
    });
    await this.groupRoleRepository.save(role);

    return group;
  }

  async getGroup(id: string): Promise<Group> {
    const group: Group = await this.groupRepository.findOneBy({ id });
    if (!group) {
      this.logger.error(`Group: ${id} dosen't exists`);
      throw new NotFoundException(`Group: ${id} dosen't exists`);
    }
    return group;
  }

  async getAllGroups(): Promise<Group[]> {
    const quary = this.groupRepository.createQueryBuilder('group');
    const groups = await quary.getMany();

    if (!groups) {
      this.logger.error(`Couldn't find groups`);
      throw new UnauthorizedException();
    }

    return groups;
  }
}
