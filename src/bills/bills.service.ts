import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { Bill } from './entities/bill.entity';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
  ) {}

  async findAll(query?: FindManyOptions<Bill>): Promise<Bill[]> {
    return await this.billRepository.find(query);
  }

  async findOne(query: FindOneOptions<Bill>): Promise<Bill> {
    const user = await this.billRepository.findOne(query);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async create(data: Partial<Bill>): Promise<Bill> {
    try {
      const user = this.billRepository.create(data);
      return await this.billRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Malformatted user data');
    }
  }

  calculateTotal(bills: Bill[]) {
    return bills.reduce((acc, bill) => acc + bill.amount, 0);
  }
}
