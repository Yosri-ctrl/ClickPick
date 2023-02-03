import { Module } from '@nestjs/common';
import { PickService } from './pick.service';
import { PickController } from './pick.controller';
import { PickReposiroty } from './pick.repository';
import { Pick } from './pick.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [PickService, PickReposiroty],
  controllers: [PickController],
  imports: [TypeOrmModule.forFeature([Pick])],
})
export class PickModule {}
