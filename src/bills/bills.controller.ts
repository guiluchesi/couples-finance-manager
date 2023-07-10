import { Body, Controller, Get, Query } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';

import { BillsService } from './bills.service';
import { Bill } from './entities/bill.entity';

@Controller('users')
export class BillsController {
  constructor(private readonly usersService: BillsService) {}

  @Get()
  async getBills(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query() query: FindOneOptions<Bill>['where'],
  ): Promise<Bill[]> {
    return this.usersService.findAll({
      where: query,
      take,
      skip,
    });
  }

  async createBill(@Body() user: Bill): Promise<Bill> {
    return this.usersService.create(user);
  }
}
