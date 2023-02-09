import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from './group.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [GroupsService],
  controllers: [GroupsController],
  imports: [TypeOrmModule.forFeature([Groups]), AuthModule],
})
export class GroupsModule {}
