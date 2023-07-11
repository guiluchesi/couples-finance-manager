import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { generateFakeUser, generateFakeUsers } from './factories/users.factory';
import { UsersService } from './users.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockedUsers = generateFakeUsers();
      userRepository.find.mockReturnValue(mockedUsers);

      const users = await service.findAll();
      expect(users).toBe(mockedUsers);
    });

    it('should search for the passed query params', async () => {
      userRepository.find.mockReturnValue([]);

      await service.findAll({
        where: {
          income: 1000,
        },
      });

      expect(userRepository.find).toHaveBeenCalledWith({
        where: { income: 1000 },
      });
    });
  });

  describe('findOne', () => {
    const mockedUser = generateFakeUser();

    it('should return a user', async () => {
      userRepository.findOne.mockResolvedValueOnce(mockedUser);

      const user = await service.findOne({ where: { id: mockedUser.id } });
      expect(user).toBe(mockedUser);
    });

    it('should search for the passed query params', async () => {
      userRepository.findOne.mockResolvedValueOnce(mockedUser);

      await service.findOne({ where: { id: mockedUser.id } });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockedUser.id },
      });
    });

    it('should throw an error if no user is found', async () => {
      userRepository.findOne.mockResolvedValueOnce(undefined);

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
    const mockedUser = generateFakeUser();

    it('should save the user with the passed data', async () => {
      userRepository.save.mockResolvedValueOnce(mockedUser);

      const user = await service.create(mockedUser);
      expect(user).toBe(mockedUser);
    });

    it('should throw an error if there is an issue with the user data', async () => {
      userRepository.save.mockRejectedValueOnce(new Error());

      try {
        await service.create(mockedUser);
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Malformatted user data');
      }
    });
  });

  describe('calculateBillParticipation', () => {
    it('should add the percentage of the bills to users', () => {
      const mockedUsers = generateFakeUsers().map((user) => ({
        ...user,
        income: 1000,
      }));

      const usersWithBillParticipation =
        service.calcuteBillParticipation(mockedUsers);

      const usersBillPercentage = usersWithBillParticipation.map(
        (user) => user.billParticipation,
      );
      expect(usersBillPercentage).toEqual([0.5, 0.5]);
    });
  });
});
