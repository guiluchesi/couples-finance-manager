import { faker } from '@faker-js/faker';

import { generateFakeBills } from 'src/bills/factories/bills.factory';
import {
  generateFakeUser,
  generateFakeUsers,
} from 'src/users/factories/users.factory';

import { Group } from '../entities/group.entity';

export const generateFakeGroup = (): Group => ({
  id: faker.string.uuid(),
  name: faker.lorem.words(3),
  bills: generateFakeBills(3),
  owner: generateFakeUser(),
  users: generateFakeUsers(2),
});

export const generateFakeGroups = (amountOfGroups = 2): Group[] => {
  const groups = [];

  for (let i = 0; i < amountOfGroups; i++) {
    groups.push(generateFakeGroup());
  }

  return groups;
};
