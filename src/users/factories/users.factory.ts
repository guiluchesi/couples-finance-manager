import { faker } from '@faker-js/faker';

import { User } from '../entities/user.entity';

export const generateFakeUser = (): User => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  income: Number(faker.finance.amount({ min: 1000, max: 10000 })),
  ownedGroups: [],
  groups: [],
});

export const generateFakeUsers = (amountOfUsers = 2): User[] => {
  const users = [];

  for (let i = 0; i < amountOfUsers; i++) {
    users.push(generateFakeUser());
  }

  return users;
};
