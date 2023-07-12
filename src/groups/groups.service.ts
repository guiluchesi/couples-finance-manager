import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
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
}
