import { Module } from '@nestjs/common';
import { PickController } from './pick.controller';
import { Pick } from './pick.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PickService } from './pick.service';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
  providers: [PickService],
  controllers: [PickController],
  imports: [TypeOrmModule.forFeature([Pick]), AuthModule, GroupsModule],
  exports: [PickService],
})
export class PickModule {}
