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
import { Group } from './group.entity';
import { GroupsService } from './groups.service';

@Controller('groups')
@UseGuards(AuthGuard())
export class GroupsController {
  constructor(private groupService: GroupsService) {}
  private logger = new Logger('Group controller');

  @Post()
  createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @GetUser() user: User,
  ): Promise<Group> {
    this.logger.verbose(`Creating group: '${createGroupDto.title}'`);
    return this.groupService.createGroup(createGroupDto, user);
  }

  @Get('/getall')
  getAllGroups(@Query('search') search: string): Promise<Group[]> {
    this.logger.verbose(`Getting all groups`);
    return this.groupService.getAllGroups(search);
  }

  @Get('/:id')
  getGroup(@Param('id') id: string): Promise<Group> {
    this.logger.verbose(`Getting group: '${id}'`);
    return this.groupService.getGroup(id);
  }

  @Patch('/:id/title')
  updateGroupTilte(
    @Body() updateGroupTitleDto: UpdateGroupTitleDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<Group> {
    //logging
    return this.groupService.updateGroupTitle(updateGroupTitleDto, id, user);
  }

  @Patch('/:id/desc')
  updateGroupDescriptiodn(
    @Body() updateGroupDescDto: UpdateGroupDescDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<Group> {
    //logging
    return this.groupService.updateGroupDesc(updateGroupDescDto, id, user);
  }

  @Patch('/:id/admin')
  addAdmin(
    @Body('user') userToPromote: string,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    //logging
    return this.groupService.addAdmin(id, user, userToPromote);
  }

  @Patch('/:id/join')
  joinGroup(@GetUser() user: User, @Param('id') id: string): Promise<void> {
    //logging
    return this.groupService.joinGroup(user, id);
  }

  @Delete('/:id/leave')
  leaveGroup(@GetUser() user: User, @Param('id') id: string): Promise<void> {
    //logging
    return this.groupService.leaveGroup(user, id);
  }
}
