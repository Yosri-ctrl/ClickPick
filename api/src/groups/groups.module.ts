import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { AuthModule } from 'src/auth/auth.module';
import { GroupsRole } from './groupsRole/groupsRole.entity';
import { GroupsPick } from './groupsPick/groupsPick.entity';

@Module({
  providers: [GroupsService],
  controllers: [GroupsController],
  imports: [
    TypeOrmModule.forFeature([Group, GroupsRole, GroupsPick]),
    AuthModule,
  ],
})
export class GroupsModule {}
