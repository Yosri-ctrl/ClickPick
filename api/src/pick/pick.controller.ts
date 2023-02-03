import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePickDto } from './dto/create-pick.dto';
import { Pick } from './pick.entity';
import { PickService } from './pick.service';

@Controller('pick')
export class PickController {
  constructor(private pickSevice: PickService) {}
  private logger = new Logger('Pick controller');

  @Post()
  createPick(@Body() createPick: CreatePickDto): Promise<Pick> {
    this.logger.verbose(`Creating a Pick with content: ${createPick.content}`);
    return this.pickSevice.createPick(createPick);
  }

  @Get('/:id')
  getOnPick(@Param('id') id: string): Promise<Pick> {
    this.logger.verbose(`Fetching data for Pick with id: ${id}`);
    return this.pickSevice.getOnePick(id);
  }

  @Get()
  getAllPick(): Promise<Pick[]> {
    this.logger.verbose(`Fetching data for all Picks`);
    return this.pickSevice.getAllPicks();
  }

  @Patch('/:id/content')
  updatePickContent(
    @Param('id') id: string,
    @Body() contentPickDto: CreatePickDto,
  ): Promise<Pick> {
    this.logger.verbose(
      `Updating Pick: ${id} with content: ${contentPickDto.content}`,
    );
    return this.pickSevice.updatePickContent(id, contentPickDto);
  }

  @Delete('/:id')
  deletePick(@Param('id') id: string): Promise<void> {
    return this.pickSevice.deletPick(id);
  }
}
