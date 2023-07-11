import { Test, TestingModule } from '@nestjs/testing';

import { generateFakeUser, generateFakeUsers } from './factories/users.factory';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

type MockService = Partial<Record<keyof UsersService, jest.Mock>>;
const createMockService = (): MockService => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  calcuteBillParticipation: jest.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;
  let userService: MockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: createMockService(),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockedUsers = generateFakeUsers();

      userService.findAll.mockResolvedValueOnce(mockedUsers);

      const users = await controller.getUsers(undefined, undefined, {});

      expect(users).toEqual(mockedUsers);
    });

    it('should search for the passed query params', async () => {
      await controller.getUsers(10, undefined, { income: 1000 });

      expect(userService.findAll).toHaveBeenCalledWith({
        where: { income: 1000 },
        take: 10,
      });
    });
  });

  describe('createUser', () => {
    it('should create a user with provided data', async () => {
      const user = generateFakeUser();
      userService.create.mockResolvedValueOnce(user);

      await controller.createUser(user);

      expect(userService.create).toBeCalledWith(user);
    });

    it('should return the created user', async () => {
      const user = generateFakeUser();
      userService.create.mockResolvedValueOnce(user);

      const createdUser = await controller.createUser(user);

      expect(createdUser).toEqual(user);
    });
  });

  describe('getUsersBillParticipation', () => {
    const mockedUsers = generateFakeUsers();

    it('should return an array of users with bill participation', async () => {
      const mockedUsersFixedIncome = mockedUsers.map((user) => ({
        ...user,
        income: 1000,
      }));
      const usersWithExpectedParticipation = mockedUsersFixedIncome.map(
        (user) => ({
          ...user,
          billParticipation: 0.5,
        }),
      );

      userService.findAll.mockResolvedValueOnce(mockedUsersFixedIncome);
      userService.calcuteBillParticipation.mockReturnValueOnce(
        usersWithExpectedParticipation,
      );

      const users = await controller.getUsersBillParticipation();

      expect(userService.findAll).toBeCalledTimes(1);
      expect(userService.calcuteBillParticipation).toBeCalledWith(
        mockedUsersFixedIncome,
      );
      expect(users).toEqual(usersWithExpectedParticipation);
    });
  });
});
