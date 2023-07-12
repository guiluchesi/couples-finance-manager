import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Group } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User])],
  providers: [GroupsService, UsersService],
  controllers: [GroupsController],
})
export class GroupsModule {}
