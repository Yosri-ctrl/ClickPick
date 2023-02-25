import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreatePickDto } from './dto/create-pick.dto';
import { Pick } from './pick.entity';
import { PickService } from './pick.service';

@Controller('pick')
@UseGuards(AuthGuard())
export class PickController {
  constructor(private pickService: PickService) {}
  private logger = new Logger('Pick controller');

  @Post()
  createPick(
    @Body() createPick: CreatePickDto,
    @GetUser() user: User,
  ): Promise<Pick> {
    this.logger.verbose(`Creating a Pick with content: ${createPick.content}`);
    return this.pickService.createPick(createPick, user);
  }

  @Get('/:id')
  getOnPick(@Param('id') id: string): Promise<Pick> {
    this.logger.verbose(`Fetching data for Pick with id: ${id}`);
    return this.pickService.getPickById(id);
  }

  @Patch('/:id/content')
  updatePickContent(
    @Param('id') id: string,
    @Body('content') content: string,
    @GetUser() user: User,
  ): Promise<Pick> {
    this.logger.verbose(`Updating ${id}, content: ${content}`);
    return this.pickService.updatePickContent(id, content, user);
  }

  @Get('/userallpicks')
  getAllPick(@GetUser() user: User): Promise<Pick[]> {
    this.logger.verbose(`Fetching data for all Picks from user: ${user.id}`);
    return this.pickService.getAllPicksFromUser(user);
  }

  // @Delete('/:id')
  // deletePick(@Param('id') id: string): Promise<void> {
  //   this.logger.verbose(`Deleting Pick with id: ${id}`);
  //   return this.pickRepo.deletPick(id);
  // }
}
