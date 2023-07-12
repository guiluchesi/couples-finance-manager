import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
}
