import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserWithBillParticipationRto } from './rto/user-with-bill-participation.rto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: CreateUserDto): Promise<User[]> {
    const { take, skip, ...where } = query;

    return this.usersService.findAll({
      where,
      take: take || undefined,
      skip: skip || undefined,
    });
  }

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get('/bill-participation')
  async getUsersBillParticipation(): Promise<UserWithBillParticipationRto[]> {
    const users = await this.usersService.findAll();
    return this.usersService.calcuteBillParticipation(users);
  }
}
