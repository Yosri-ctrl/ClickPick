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

  /**
   * It finds a pick by id and if it doesn't exist, it throws a NotFoundException
   * @param {string} id - string - the id of the pick we want to retrieve
   * @returns A pick object
   */
  async getPickById(id: string): Promise<Pick> {
    const pick = await this.pickEntityRepository.findOneBy({ id });
    if (!pick) {
      this.logger.error(`Pick with id: ${id} not found`);
      throw new NotFoundException();
    }
    return pick;
  }

  /**
   * It takes an id, content, and user, and returns a promise of a pick
   * @param {string} id - The id of the pick we want to update
   * @param {string} content - string,
   * @param {User} user - User - This is the user object that is currnetly login
   * @returns Pick
   */
  async updatePickContent(
    id: string,
    content: string,
    user: User,
  ): Promise<Pick> {
    const pick = await this.pickEntityRepository
      .createQueryBuilder('pick')
      .where('pick.id = :id', { id: id })
      .andWhere('pick.user = :uid', { uid: user.id })
      .getOne();

    if (!pick) {
      this.logger.error('Pick not found', '');
      throw new NotFoundException('Pick not found');
    }
    pick.content = content;
    await this.pickEntityRepository.save(pick);

    return pick;
  }
}
