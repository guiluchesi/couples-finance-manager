import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Group } from './entities/group.entity';
import {
  generateFakeGroup,
  generateFakeGroups,
} from './factories/group.factory';
import { GroupsService } from './groups.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('GroupsService', () => {
  let service: GroupsService;
  let groupRepository: MockRepository<Group>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    groupRepository = module.get(getRepositoryToken(Group));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      const mockedGroups = generateFakeGroups();
      groupRepository.find.mockReturnValue(mockedGroups);

      const groups = await service.findAll();
      expect(groups).toBe(mockedGroups);
    });

    it('should search for the passed query params', async () => {
      groupRepository.find.mockReturnValue([]);

      await service.findAll({
        where: {
          name: 'Testing',
        },
      });

      expect(groupRepository.find).toHaveBeenCalledWith({
        where: { name: 'Testing' },
      });
    });
  });

  describe('findOne', () => {
    const mockedGroup = generateFakeGroup();

    it('should return a group', async () => {
      groupRepository.findOne.mockResolvedValueOnce(mockedGroup);

      const group = await service.findOne({ where: { id: mockedGroup.id } });
      expect(group).toBe(mockedGroup);
    });

    it('should search for the passed query params', async () => {
      groupRepository.findOne.mockResolvedValueOnce(mockedGroup);

      await service.findOne({ where: { id: mockedGroup.id } });

      expect(groupRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockedGroup.id },
      });
    });

    it('should throw an error if no group is found', async () => {
      groupRepository.findOne.mockResolvedValueOnce(undefined);

      try {
        await service.findOne({ where: { id: mockedGroup.id } });
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Group not found');
      }
    });
  });

  describe('create', () => {
    const mockedGroup = generateFakeGroup();

    it('should save the group with the passed data', async () => {
      groupRepository.save.mockResolvedValueOnce(mockedGroup);

      const group = await service.create(mockedGroup);
      expect(group).toBe(mockedGroup);
    });

    it('should throw an error if there is an issue with the group data', async () => {
      groupRepository.save.mockRejectedValueOnce(new Error());

      try {
        await service.create(mockedGroup);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Malformatted group data');
      }
    });
  });

  describe('getUsers', () => {
    it('should return an array of users associated with the group', async () => {
      const mockedGroup = generateFakeGroup();
      groupRepository.findOne.mockResolvedValueOnce(mockedGroup);

      const users = await service.getUsers(mockedGroup.id);
      expect(users).toBe(mockedGroup.users);
    });
  });
});
