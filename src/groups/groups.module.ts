import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BillsService } from 'src/bills/bills.service';
import { Bill } from 'src/bills/entities/bill.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { Group } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Group, User])],
  providers: [GroupsService, UsersService, BillsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
