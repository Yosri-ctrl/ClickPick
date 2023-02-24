import { Module } from '@nestjs/common';
import { PickController } from './pick.controller';
import { PickReposiroty } from './pick.repository';
import { Pick } from './pick.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PickService } from './pick.service';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
  providers: [PickService, PickReposiroty],
  controllers: [PickController],
  imports: [TypeOrmModule.forFeature([Pick]), AuthModule, GroupsModule],
})
export class PickModule {}
