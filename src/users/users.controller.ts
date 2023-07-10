import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query() query: FindOneOptions<User>['where'],
  ): Promise<User[]> {
    return this.usersService.findAll({
      where: query,
      take,
      skip,
    });
  }

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }
}
