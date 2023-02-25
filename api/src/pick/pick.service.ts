import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { GroupsService } from 'src/groups/groups.service';
import { Repository } from 'typeorm';
import { CreatePickDto } from './dto/create-pick.dto';
import { Pick } from './pick.entity';

@Injectable()
export class PickService {
  constructor(
    @InjectRepository(Pick)
    private readonly pickEntityRepository: Repository<Pick>,
    private groupService: GroupsService,
  ) {}
  private logger = new Logger('Pick Service');

  /**
   * It creates a new pick and saves it to the database
   * @param {CreatePickDto} createPickDto - CreatePickDto
   * @param {User} user - User - this is the user that is currently logged in.
   * @returns Pick
   */
  async createPick(createPickDto: CreatePickDto, user: User): Promise<Pick> {
    const { content, id } = createPickDto;
    const group = await this.groupService.getGroup(id);

    const pick: Pick = this.pickEntityRepository.create({
      content,
      user,
      group,
    });

    await this.pickEntityRepository.save(pick);
    return pick;
  }

  async getPickById(id: string): Promise<Pick> {
    const pick = await this.pickEntityRepository.findOneBy({ id });
    if (!pick) {
      this.logger.error(`Pick with id: ${id} not found`);
      throw new NotFoundException();
    }
    return pick;
  }
}
