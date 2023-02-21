import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDescDto } from './dto/update-group-desc.dto';
import { UpdateGroupTitleDto } from './dto/update-group-title.dto';
import { UpdateGroupTypeDto } from './dto/update-group-type.dto';
import { Group } from './group.entity';
import { GroupsService } from './groups.service';

@Controller('groups')
@UseGuards(AuthGuard())
export class GroupsController {
  constructor(private groupService: GroupsService) {}
  private logger = new Logger('Group controller');

  /* This is a method that is used to create a group. */
  @Post()
  createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @GetUser() user: User,
  ): Promise<Group> {
    this.logger.verbose(`Creating group: '${createGroupDto.title}'`);
    return this.groupService.createGroup(createGroupDto, user);
  }

  /* This is a method that is used to get all groups. */
  @Get('/getall')
  getAllGroups(@Query('search') search: string): Promise<Group[]> {
    this.logger.verbose(`Getting all groups`);
    return this.groupService.getAllGroups(search);
  }

  /* This is a method that is used to get a group by its id. */
  @Get('/:id')
  getGroup(@Param('id') id: string): Promise<Group> {
    this.logger.verbose(`Getting group: '${id}'`);
    return this.groupService.getGroup(id);
  }

  /* Updating the title of a group. */
  @Patch('/:id/title')
  updateGroupTilte(
    @Body() updateGroupTitleDto: UpdateGroupTitleDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<Group> {
    this.logger.verbose(`Updatig title for group: '${id}'`);
    return this.groupService.updateGroupTitle(updateGroupTitleDto, id, user);
  }

  /* Updating the description of a group. */
  @Patch('/:id/desc')
  updateGroupDescriptiodn(
    @Body() updateGroupDescDto: UpdateGroupDescDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<Group> {
    this.logger.verbose(`Updatig description group: '${id}'`);
    return this.groupService.updateGroupDesc(updateGroupDescDto, id, user);
  }

  /* Adding an admin to a group. */
  @Patch('/:id/admin')
  addAdmin(
    @Body('user') userToPromote: string,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    this.logger.verbose(`Adding an admin to group: '${id}'`);
    return this.groupService.addAdmin(id, user, userToPromote);
  }

  /* A method that is used to join a group. */
  @Patch('/:id/join')
  joinGroup(@GetUser() user: User, @Param('id') id: string): Promise<void> {
    this.logger.verbose(`Join user: ${user.id} group: '${id}'`);
    return this.groupService.joinGroup(user, id);
  }

  /* Deleting a user from a group. */
  @Delete('/:id/leave')
  leaveGroup(@GetUser() user: User, @Param('id') id: string): Promise<void> {
    this.logger.verbose(`Removing user: ${user.id} group: '${id}'`);
    return this.groupService.leaveGroup(user, id);
  }

  /* This is a method that is used to get all users from a group. */
  @Get('/:id/users')
  getAllUsers(@Param('id') id: string): Promise<User[]> {
    this.logger.verbose(`Get all users from group: ${id}`);
    return this.groupService.getAllUsers(id);
  }

  /* This is a method that is used to change the type of a group. */
  @Patch('/:id/type')
  changeGroupType(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() type: UpdateGroupTypeDto,
  ): Promise<Group> {
    this.logger.verbose(`Change group type: ${id}`);
    return this.groupService.changeGroupType(id, type, user);
  }

  /* This is a method that is used to remove an admin from a group. */
  @Delete('/:id/admin')
  removeAdmin(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body('admin') admin: string,
  ) {
    this.logger.verbose(`Removing admin: ${admin}`);
    return this.groupService.removeAdmin(id, user, admin);
  }

  /* This is a method that is used to remove a user from a group. */
  @Delete('/:id/user')
  removeUser(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body('user') toBeOut: string,
  ) {
    this.logger.verbose(`Removing user: ${toBeOut}`);
    return this.groupService.removeUser(id, user, toBeOut);
  }

  /* This is a method that is used to delete a group. */
  @Delete('/:id/group')
  deleteGroup(@GetUser() user: User, @Param('id') id: string) {
    return this.groupService.deletGroup(id, user);
  }
}
