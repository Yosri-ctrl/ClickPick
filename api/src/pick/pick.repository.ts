import { Injectable, Logger } from '@nestjs/common';
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
}
