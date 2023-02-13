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

  async getUserRole(group: Group, user: string): Promise<GroupsRole> {
    const query = this.groupRoleRepository
      .createQueryBuilder('role')
      .where('role.group_id = :gid', { gid: group.id })
      .andWhere('role.user_id = :uid', { uid: user });

    return await query.getOne();
  }

  async updateGroupTitle(
    updateGroupTitleDto: UpdateGroupTitleDto,
    id: string,
    user: User,
  ): Promise<Group> {
    const { title } = updateGroupTitleDto;
    const group: Group = await this.getGroup(id);

    const role = await this.getUserRole(group, user.id);
    if (!role || role.role != 'OWNER') {
      this.logger.error("User Dosen't have permission");
      throw new UnauthorizedException("User Dosen't have permission");
    }

    // Check if title already exists ...
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

    const role = await this.getUserRole(group, user.id);
    if (!role || role.role != 'OWNER') {
      this.logger.error("User Dosen't have permission");
      throw new UnauthorizedException("User Dosen't have permission");
    }

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

    const role = await this.getUserRole(group, user.id);
    if (!role || role.role != 'OWNER') {
      this.logger.error("User Dosen't have permission");
      throw new UnauthorizedException("User Dosen't have permission");
    }

    const adminRole = await this.getUserRole(group, userToPromoteId);
    if (!adminRole) {
      this.logger.error('User is not joined to this group', '');
      throw new UnauthorizedException('User is not joined to this group');
    }
    if (adminRole.role == 'ADMIN') {
      this.logger.error('User is already an ADMIN', '');
      throw new UnauthorizedException('User is already an ADMIN');
    }

    adminRole.role = roleType.admin;
    await this.groupRoleRepository.save(adminRole);

    return group;
  }

  async joinGroup(user: User, id: string): Promise<void> {
    const group: Group = await this.getGroup(id);

    const role2 = await this.getUserRole(group, user.id);
    if (role2) {
      this.logger.error('User already joined this group', '');
      throw new UnauthorizedException('User already joined this group');
    }

    const role: GroupsRole = this.groupRoleRepository.create({
      group_id: group,
      user_id: user,
      role: roleType.user,
    });
    await this.groupRoleRepository.save(role);
  }
}
