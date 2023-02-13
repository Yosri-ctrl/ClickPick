import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupTitleDto } from './dto/update-group-title.dto';
import { UpdateGroupDescDto } from './dto/update-group-desc.dto';
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

  async getAllGroups(search?: string): Promise<Group[]> {
    const query = this.groupRepository.createQueryBuilder('group');
    query.andWhere('group.type LIKE (:type)', { type: 'PUBLIC' });
    if (search) {
      query.andWhere(
        '(LOWER(group.title) LIKE LOWER(:search) OR LOWER(group.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const groups = await query.getMany();
      return groups;
    } catch (err) {
      this.logger.error(
        `Failed to retrieve data for group with search: "${search}"`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getUserRole(
    group: Group,
    user: string,
    roleToCheck: string,
  ): Promise<GroupsRole> {
    const query = this.groupRoleRepository
      .createQueryBuilder('role')
      .where('role.group_id = :gid', { gid: group.id })
      .andWhere('role.user_id = :uid', { uid: user });

    const role = await query.getOne();
    if (!role || role.role != roleToCheck) {
      this.logger.error("User Dosen't have permission");
      throw new UnauthorizedException("User Dosen't have permission");
    }

    return role;
  }

  async updateGroupTitle(
    updateGroupTitleDto: UpdateGroupTitleDto,
    id: string,
    user: User,
  ): Promise<Group> {
    const { title } = updateGroupTitleDto;
    const group: Group = await this.getGroup(id);

    await this.getUserRole(group, user.id, 'OWNER');

    // const newT = await this.groupRepository.findOneBy({ title: title });
    // if (newT.title == title) {
    //   this.logger.error('Title already exists');
    //   throw new ConflictException('Title already exists');
    // }

    group.title = title;

    await this.groupRepository.save(group);
    return group;
  }

  async updateGroupDesc(
    updateGroupDescDto: UpdateGroupDescDto,
    id: string,
    user: User,
  ): Promise<Group> {
    const { description } = updateGroupDescDto;
    const group: Group = await this.getGroup(id);

    await this.getUserRole(group, user.id, 'OWNER');

    // const newT = await this.groupRepository.findOneBy({ title: title });
    // if (newT.title == title) {
    //   this.logger.error('Title already exists');
    //   throw new ConflictException('Title already exists');
    // }

    group.description = description;

    await this.groupRepository.save(group);
    return group;
  }

  async addAdmin(
    gid: string,
    user: User,
    userToPromoteId: string,
  ): Promise<Group> {
    const group: Group = await this.getGroup(gid);

    await this.getUserRole(group, user.id, 'OWNER');
    const adminRole = await this.getUserRole(group, userToPromoteId, 'USER');
    console.log(adminRole);

    // adminRole.role = 'ADMIN';

    return group;
  }
}
