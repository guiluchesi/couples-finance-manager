import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BillsService } from 'src/bills/bills.service';
import { UsersService } from 'src/users/users.service';
import { Group } from './entities/group.entity';
import {
  generateFakeGroup,
  generateFakeGroups,
} from './factories/group.factory';
import { GroupsService } from './groups.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockService<T = any> = Partial<Record<keyof T, jest.Mock>>;
type MockUserService = MockService<UsersService>;
type MockBillService = MockService<BillsService>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const usersServiceMock: MockUserService = {
  calcuteBillParticipation: jest.fn(),
};

const billsServiceMock: MockBillService = {
  calculateTotal: jest.fn(),
};

describe('GroupsService', () => {
  let service: GroupsService;
  let groupRepository: MockRepository<Group>;
  let userService: MockUserService;
  let billService: MockBillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useValue: createMockRepository(),
        },
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: BillsService,
          useValue: billsServiceMock,
        },
      ],
    }).compile();

    service = module.get(GroupsService);
    groupRepository = module.get(getRepositoryToken(Group));
    userService = module.get<MockUserService>(UsersService);
    billService = module.get<MockBillService>(BillsService);
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

  describe('getSplitBill', () => {
    it('should return the split bill for the group', async () => {
      const mockedGroup = generateFakeGroup();
      const [firstUser, secondUser] = mockedGroup.users;
      const totalBill = 6000;

      groupRepository.findOne.mockResolvedValueOnce(mockedGroup);
      userService.calcuteBillParticipation.mockReturnValueOnce([
        { ...firstUser, billParticipation: 1 / 3 },
        { ...secondUser, billParticipation: 2 / 3 },
      ]);
      billService.calculateTotal.mockReturnValueOnce(totalBill);

      const splitBill = await service.getSplitBill(mockedGroup.id);

      expect(splitBill).toEqual([
        {
          userId: firstUser.id,
          amount: 2000,
        },
        {
          userId: secondUser.id,
          amount: 4000,
        },
      ]);
    });
  });
});
