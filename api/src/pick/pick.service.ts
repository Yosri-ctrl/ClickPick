import { Injectable } from '@nestjs/common';
import { CreatePickDto } from './dto/create-pick.dto';
import { Pick } from './pick.entity';
import { PickReposiroty } from './pick.repository';

@Injectable()
export class PickService {
  constructor(private pickRepository: PickReposiroty) {}

  createPick(createPickDto: CreatePickDto): Promise<Pick> {
    return this.pickRepository.createPick(createPickDto);
  }
}
