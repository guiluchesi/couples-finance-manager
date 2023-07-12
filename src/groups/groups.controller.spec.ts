import { Test, TestingModule } from '@nestjs/testing';

import { generateFakeGroup } from './factories/group.factory';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

type MockService = Partial<Record<keyof GroupsService, jest.Mock>>;
const createMockService = (): MockService => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  getSplitBill: jest.fn(),
});

describe('GroupsController', () => {
  let controller: GroupsController;
  let groupService: MockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useValue: createMockService(),
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    groupService = module.get(GroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getGroups', () => {
    it('should return an array of groups', async () => {
      const mockedGroups = generateFakeGroup();

      groupService.findAll.mockResolvedValueOnce(mockedGroups);

      const groups = await controller.getGroups(undefined, undefined, {});

      expect(groups).toEqual(mockedGroups);
    });

    it('should search for the passed query params', async () => {
      await controller.getGroups(10, undefined, { name: 'Testing' });

      expect(groupService.findAll).toHaveBeenCalledWith({
        where: { name: 'Testing' },
        take: 10,
      });
    });
  });

  describe('createGroup', () => {
    const group = generateFakeGroup();

    it('should create a group with provided data', async () => {
      groupService.create.mockResolvedValueOnce(group);

      await controller.createGroup(group);

      expect(groupService.create).toBeCalledWith(group);
    });

    it('should return the created group', async () => {
      groupService.create.mockResolvedValueOnce(group);

      const createdGroup = await controller.createGroup(group);

      expect(createdGroup).toEqual(group);
    });
  });

  describe('getSplitBill', () => {
    const group = generateFakeGroup();

    it('should return the split bill', async () => {
      const splitBill = [
        { userId: '1', amount: 10 },
        { userId: '2', amount: 20 },
      ];
      groupService.findOne.mockResolvedValueOnce(group);
      groupService.getSplitBill.mockResolvedValueOnce(splitBill);

      const result = await controller.getSplitBill(group.id);

      expect(groupService.findOne).toBeCalledTimes(1);
      expect(groupService.findOne).toBeCalledWith({
        where: { id: group.id },
        relations: ['users', 'bills'],
      });

      expect(groupService.getSplitBill).toBeCalledTimes(1);
      expect(groupService.getSplitBill).toBeCalledWith(group);
      expect(result).toEqual(splitBill);
    });
  });
});
