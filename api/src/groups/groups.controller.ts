import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
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
    this.logger.verbose(`Creating group: ${createGroupDto.title}`);
    return this.groupService.createGroup(createGroupDto, user);
  }
}
