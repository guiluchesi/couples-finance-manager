import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BillsService } from './bills.service';
import { Bill } from './entities/bill.entity';
import { generateFakeBill, generateFakeBills } from './factories/bills.factory';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('BillsService', () => {
  let service: BillsService;
  let billRepository: MockRepository<Bill>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillsService,
        {
          provide: getRepositoryToken(Bill),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<BillsService>(BillsService);
    billRepository = module.get(getRepositoryToken(Bill));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockedUsers = generateFakeBills();
      billRepository.find.mockReturnValue(mockedUsers);

      const users = await service.findAll();
      expect(users).toBe(mockedUsers);
    });

    it('should search for the passed query params', async () => {
      billRepository.find.mockReturnValue([]);

      await service.findAll({
        where: {
          amount: 1000,
        },
      });

      expect(billRepository.find).toHaveBeenCalledWith({
        where: { amount: 1000 },
      });
    });
  });

  describe('findOne', () => {
    const mockedUser = generateFakeBill();

    it('should return a user', async () => {
      billRepository.findOne.mockResolvedValueOnce(mockedUser);

      const user = await service.findOne({ where: { id: mockedUser.id } });
      expect(user).toBe(mockedUser);
    });

    it('should search for the passed query params', async () => {
      billRepository.findOne.mockResolvedValueOnce(mockedUser);

      await service.findOne({ where: { id: mockedUser.id } });

      expect(billRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockedUser.id },
      });
    });

    it('should throw an error if no user is found', async () => {
      billRepository.findOne.mockResolvedValueOnce(undefined);

      try {
        await service.findOne({ where: { id: mockedUser.id } });
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('create', () => {
    const mockedUser = generateFakeBill();

    it('should save the user with the passed data', async () => {
      billRepository.save.mockResolvedValueOnce(mockedUser);

      const user = await service.create(mockedUser);
      expect(user).toBe(mockedUser);
    });

    it('should throw an error if there is an issue with the user data', async () => {
      billRepository.save.mockRejectedValueOnce(new Error());

      try {
        await service.create(mockedUser);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Malformatted user data');
      }
    });
  });
});
