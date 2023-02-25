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

  // @Get()
  // getAllPick(): Promise<Pick[]> {
  //   this.logger.verbose(`Fetching data for all Picks`);
  //   return this.pickRepo.getAllPick();
  // }

  // @Patch('/:id/content')
  // updatePickContent(
  //   @Param('id') id: string,
  //   @Body() contentPickDto: CreatePickDto,
  // ): Promise<Pick> {
  //   this.logger.verbose(`Updating ${id}, content: ${contentPickDto.content}`);
  //   return this.pickRepo.updatePickContent(id, contentPickDto);
  // }

  // @Delete('/:id')
  // deletePick(@Param('id') id: string): Promise<void> {
  //   this.logger.verbose(`Deleting Pick with id: ${id}`);
  //   return this.pickRepo.deletPick(id);
  // }
}
