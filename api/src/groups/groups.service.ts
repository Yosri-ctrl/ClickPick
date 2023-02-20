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
import { UpdateGroupTypeDto } from './dto/update-group-type.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupsRole)
    private readonly groupRoleRepository: Repository<GroupsRole>,
  ) {}
  private logger = new Logger('Groups service');

  /**
   * It creates a group and assigns the user who created the group as the owner of the group
   * @param {CreateGroupDto} createGroupDto - CreateGroupDto - Have a title and description.
   * @param {User} user - User - this is the user that is currently logged in.
   * @returns Group
   */
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

  /**
   * It gets a group by its id
   * @param {string} id - string - The id of the group we want to retrieve.
   * @returns Group
   */
  async getGroup(id: string): Promise<Group> {
    const group: Group = await this.groupRepository.findOneBy({ id });
    if (!group) {
      this.logger.error(`Group: ${id} dosen't exists`);
      throw new NotFoundException(`Group: ${id} dosen't exists`);
    }
    return group;
  }

  /**
   * It returns a list of groups that are public and match the search criteria
   * @param {string} [search] - string - This is the search parameter that we will pass in from the
   * controller.
   * @returns An array of groups
   */
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
      this.logger.error(`Failed to retrieve data "${err.stack}"`);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Get the role of a user in a group.
   * @param {Group} group - Group - The group object that we're getting the role for
   * @param {string} user - The user's ID
   * @returns A GroupRole object
   */
  async getUserRole(group: Group, user: string): Promise<GroupsRole> {
    const query = this.groupRoleRepository
      .createQueryBuilder('role')
      .where('role.group_id = :gid', { gid: group.id })
      .andWhere('role.user_id = :uid', { uid: user });

    return await query.getOne();
  }

  /**
   * It updates the title of a group
   * @param {UpdateGroupTitleDto} updateGroupTitleDto - UpdateGroupTitleDto.
   * @param {string} id - The id of the group to be updated
   * @param {User} user - User - The user who is making the request.
   * @returns Group
   */
  async updateGroupTitle(
    updateGroupTitleDto: UpdateGroupTitleDto,
    id: string,
    user: User,
  ): Promise<Group> {
    const { title } = updateGroupTitleDto;
    const group: Group = await this.getGroup(id);

    const role = await this.getUserRole(group, user.id);
    if (!role || role.role == 'USER') {
      this.logger.error("User Dosen't have permission");
      throw new UnauthorizedException("User Dosen't have permission");
    }

    const checkTitle: Group = await this.groupRepository.findOneBy({ title });
    if (checkTitle) {
      this.logger.error(`Group with title: '${title}' already exists`, '');
      throw new ConflictException(
        `Group with title: '${title}' already exists`,
      );
    }

    group.title = title;

    await this.groupRepository.save(group);
    return group;
  }

  /**
   * This function updates the description of a group
   * @param {UpdateGroupDescDto} updateGroupDescDto - UpdateGroupDescDto
   * @param {string} id - The user who is making the request.
   * @param {User} user - User - This is the user object that is passed in from the auth guard.
   * @returns Group
   */
  async updateGroupDesc(
    updateGroupDescDto: UpdateGroupDescDto,
    id: string,
    user: User,
  ): Promise<Group> {
    const { description } = updateGroupDescDto;
    const group: Group = await this.getGroup(id);

    const role = await this.getUserRole(group, user.id);
    if (!role || role.role == 'USER') {
      this.logger.error("User Dosen't have permission");
      throw new UnauthorizedException("User Dosen't have permission");
    }

    group.description = description;

    await this.groupRepository.save(group);
    return group;
  }

  /**
   * It adds a user to the group as an admin
   * @param {string} gid - The group id
   * @param {User} user - The user who is making the request.
   * @param {string} userToPromoteId - The user id of the user you want to promote to admin.
   * @returns Group
   */
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
    if (adminRole.role != 'USER') {
      this.logger.error('User is already an ADMIN', '');
      throw new UnauthorizedException('User is already an ADMIN');
    }

    const query = await this.groupRoleRepository
      .createQueryBuilder('role')
      .where('role.group_id = :gid', { gid: group.id })
      .andWhere("role.role = 'ADMIN'")
      .getMany();

    if (query.length > 3) {
      this.logger.error('There are already 3 admins', '');
      throw new UnauthorizedException('There are already 3 admins');
    }

    adminRole.role = roleType.admin;
    await this.groupRoleRepository.save(adminRole);

    return group;
  }

  /**
   * The function takes in a user and a group id, and then checks if the user is already in the group.
   * If the user is not in the group, the function adds the user to the group
   * @param {User} user - User - The user that is joining the group
   * @param {string} id - The id of the group you want to join
   */
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

  /**
   * The function takes in a user and a group id, and then deletes the user's role in the group
   * @param {User} user - User - The user object that is currently logged in.
   * @param {string} id - The id of the group
   */
  async leaveGroup(user: User, id: string): Promise<void> {
    const group: Group = await this.getGroup(id);

    const role = await this.getUserRole(group, user.id);
    if (!role) {
      this.logger.error('User is not joined to this group', '');
      throw new UnauthorizedException('User is not joined to this group');
    }
    if (role.role == 'OWNER') {
      this.logger.error("Owner can't leave group", '');
      throw new UnauthorizedException("Owner can't leave group");
    }
    await this.groupRoleRepository.delete(role);
  }

  /**
   * It gets all the users in a group by querying the group_role table for all the roles in a group,
   * then it gets the user_id from the role and pushes it into an array
   * @param {string} id - string - the id of the group
   * @returns An array of users
   */
  async getAllUsers(id: string): Promise<User[]> {
    const query = await this.groupRoleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.user_id', 'user')
      .where('role.group_id = :gid', { gid: id })
      .getMany();
    console.log(query);

    const users: User[] = [];
    for (let i = 0; i < query.length; i++) {
      users.push(query[i].user_id);
    }

    return users;
  }

  /**
   * It changes the group type to the one specified in the request body
   * @param {string} id - The id of the group you want to change the type of.
   * @param {UpdateGroupTypeDto} updateGroupTypeDto - UpdateGroupTypeDto
   * @param {User} user - User - this is the user that is currently logged in.
   * @returns Group
   */
  async changeGroupType(
    id: string,
    updateGroupTypeDto: UpdateGroupTypeDto,
    user: User,
  ): Promise<Group> {
    const { type } = updateGroupTypeDto;
    const group: Group = await this.getGroup(id);

    const role = await this.getUserRole(group, user.id);
    if (!role) {
      this.logger.error('User is not joined to this group', '');
      throw new UnauthorizedException('User is not joined to this group');
    }
    if (role.role == 'USER') {
      this.logger.error("User can't change group type", '');
      throw new UnauthorizedException("User can't change group type");
    }

    group.type = type;

    await this.groupRepository.save(group);
    return group;
  }

  /**
   * This function removes an admin from a group
   * @param {string} id - The id of the group
   * @param {User} user - User - The user who is making the request
   * @param {string} admin - the user id of the admin to be removed
   */
  async removeAdmin(id: string, user: User, admin: string): Promise<void> {
    const group: Group = await this.getGroup(id);

    const role: GroupsRole = await this.getUserRole(group, user.id);
    if (!role || role.role != 'OWNER') {
      this.logger.error('User is not authorised', '');
      throw new UnauthorizedException('User is not authorised');
    }

    const adminrole: GroupsRole = await this.getUserRole(group, admin);
    if (!adminrole || adminrole.role != 'ADMIN') {
      this.logger.error('User is not an admin', '');
      throw new UnauthorizedException('User is not an admin');
    }

    adminrole.role = roleType.user;
    await this.groupRoleRepository.save(adminrole);
  }

  /**
   * It removes a user from a group
   * @param {string} id - The id of the group
   * @param {User} user - User - the user who is trying to kick the other user
   * @param {string} toBeOut - the user to be kicked out of the group
   */
  async removeUser(id: string, user: User, toBeOut: string): Promise<void> {
    const group: Group = await this.getGroup(id);

    const role: GroupsRole = await this.getUserRole(group, user.id);
    if (!role || role.role == 'USER') {
      this.logger.error('User is not authorised', '');
      throw new UnauthorizedException('User is not authorised');
    }

    const userRole: GroupsRole = await this.getUserRole(group, toBeOut);
    if (!userRole || userRole.role != 'USER') {
      this.logger.error("Can't kick none user", '');
      throw new UnauthorizedException("Can't kick none user");
    }

    await this.groupRoleRepository.delete(userRole);
  }
}
