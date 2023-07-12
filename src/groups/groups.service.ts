import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

import { UsersService } from 'src/users/users.service';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly userService: UsersService,
  ) {}

  async findAll(query?: FindManyOptions<Group>): Promise<Group[]> {
    return await this.groupRepository.find(query);
  }

  async findOne(query: FindOneOptions<Group>): Promise<Group> {
    const group = await this.groupRepository.findOne(query);
    if (!group) throw new NotFoundException('Group not found');

    return group;
  }

  async create(data: Partial<Group>): Promise<Group> {
    try {
      const group = this.groupRepository.create(data);
      return await this.groupRepository.save(group);
    } catch (error) {
      throw new BadRequestException('Malformatted group data');
    }
  }

  async getUsers(groupId: string): Promise<User[]> {
    const group = await this.findOne({ where: { id: groupId } });
    return group.users;
  }

  calculateTotalBill() {
    return 100;
  }

  async getSplitBill(groupId: string) {
    const group = await this.findOne({ where: { id: groupId } });
    const totalBill = this.calculateTotalBill();

    const userWithBillParticipation = this.userService.calcuteBillParticipation(
      group.users,
    );

    const userIdAndTotalAmout = userWithBillParticipation.map((user) => {
      const splitBill = totalBill * user.billParticipation;

      return {
        userId: user.id,
        amount: splitBill,
      };
    });

    return userIdAndTotalAmout;
  }
}
