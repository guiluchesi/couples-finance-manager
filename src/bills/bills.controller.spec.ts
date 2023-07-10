import { Test, TestingModule } from '@nestjs/testing';

import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { generateFakeBill, generateFakeBills } from './factories/bills.factory';

type MockService = Partial<Record<keyof BillsService, jest.Mock>>;
const createMockService = (): MockService => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('BillsController', () => {
  let controller: BillsController;
  let userService: MockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillsController],
      providers: [
        {
          provide: BillsService,
          useValue: createMockService(),
        },
      ],
    }).compile();

    controller = module.get<BillsController>(BillsController);
    userService = module.get(BillsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBills', () => {
    it('should return an array of users', async () => {
      const mockedBills = generateFakeBills();

      userService.findAll.mockResolvedValueOnce(mockedBills);

      const users = await controller.getBills(undefined, undefined, {});

      expect(users).toEqual(mockedBills);
    });

    it('should search for the passed query params', async () => {
      await controller.getBills(10, undefined, { amount: 1000 });

      expect(userService.findAll).toHaveBeenCalledWith({
        where: { amount: 1000 },
        take: 10,
      });
    });
  });

  describe('createUser', () => {
    it('should create a user with provided data', async () => {
      const user = generateFakeBill();
      userService.create.mockResolvedValueOnce(user);

      await controller.createBill(user);

      expect(userService.create).toBeCalledWith(user);
    });

    it('should return the created user', async () => {
      const user = generateFakeBill();
      userService.create.mockResolvedValueOnce(user);

      const createdUser = await controller.createBill(user);

      expect(createdUser).toEqual(user);
    });
  });
});
