import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePickDto } from './dto/create-pick.dto';
import { Pick } from './pick.entity';

@Injectable()
export class PickReposiroty {
  constructor(
    @InjectRepository(Pick)
    private readonly pickEntityRepository: Repository<Pick>,
  ) {}
  private logger = new Logger('Pick repository');

  async createPick(createPickDto: CreatePickDto): Promise<Pick> {
    const { content } = createPickDto;
    const pick: Pick = this.pickEntityRepository.create({
      content: content,
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
    const res = await this.pickEntityRepository.remove(pick);

    // if (res.affected == 0) {
    //   this.logger.error(`Pick with id: ${id} Not found`);
    //   throw new NotFoundException();
    // }
  }
}
