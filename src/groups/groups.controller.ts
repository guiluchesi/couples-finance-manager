import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';

import { Group } from './entities/group.entity';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly usersService: GroupsService) {}

  @Get()
  async getGroups(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query() query: FindOneOptions<Group>['where'],
  ): Promise<Group[]> {
    return this.usersService.findAll({
      where: query,
      take,
      skip,
    });
  }

  @Post()
  async createGroup(@Body() user: Group): Promise<Group> {
    return this.usersService.create(user);
  }

  @Get(':id/split-bill')
  async getSplitBill(@Param('id') groupId: string) {
    const group = await this.usersService.findOne({
      where: { id: groupId },
      relations: ['users', 'bills'],
    });

    return this.usersService.getSplitBill(group);
  }
}
