import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Group } from 'src/groups/group.entity';
import { Repository } from 'typeorm';
import { CreatePickDto } from './dto/create-pick.dto';
import { Pick } from './pick.entity';

@Injectable()
export class PickReposiroty {
  constructor(
    @InjectRepository(Pick)
    private readonly pickEntityRepository: Repository<Pick>,
    @InjectRepository(Group)
    private readonly groupEntityRepository: Repository<Group>,
  ) {}
  private logger = new Logger('Pick repository');

  /**
   * It creates a new pick and saves it to the database
   * @param {CreatePickDto} createPickDto - CreatePickDto
   * @param {User} user - User - this is the user that is currently logged in.
   * @returns Pick
   */
  async createPick(createPickDto: CreatePickDto, user: User): Promise<Pick> {
    const { content, id } = createPickDto;
    const group: Group = await this.groupEntityRepository.findOneBy({ id });

    const pick: Pick = this.pickEntityRepository.create({
      content,
      user,
      group,
    });

    await this.pickEntityRepository.save(pick);
    return pick;
  }

  async getOnePick(id: string): Promise<Pick> {
    const pick = await this.pickEntityRepository.findOneBy({ id });
    if (!pick) {
      this.logger.error(`Pick with id: ${id} not found`);
      throw new NotFoundException();
    }
    return pick;
  }

  async getAllPick(): Promise<Pick[]> {
    const query = this.pickEntityRepository.createQueryBuilder('pick');
    const tasks = await query.getMany();
    return tasks;
  }

  async updatePickContent(
    id: string,
    contentPickDto: CreatePickDto,
  ): Promise<Pick> {
    const { content } = contentPickDto;
    const pick = await this.getOnePick(id);

    pick.content = content;
    await this.pickEntityRepository.save(pick);

    return pick;
  }

  async deletPick(id: string): Promise<void> {
    const pick = await this.getOnePick(id);
    // const res =
    await this.pickEntityRepository.remove(pick);

    // if (res.affected == 0) {
    //   this.logger.error(`Pick with id: ${id} Not found`);
    //   throw new NotFoundException();
    // }
  }
}
