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

  getOnePick(id: string): Promise<Pick> {
    return this.pickRepository.getOnePick(id);
  }

  getAllPicks(): Promise<Pick[]> {
    return this.pickRepository.getAllPick();
  }

  updatePickContent(id: string, contentPickDto: CreatePickDto): Promise<Pick> {
    return this.pickRepository.updatePickContent(id, contentPickDto);
  }

  deletPick(id: string): Promise<void> {
    return this.pickRepository.deletPick(id);
  }
}
