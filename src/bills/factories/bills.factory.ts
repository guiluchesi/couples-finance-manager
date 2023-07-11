import { faker } from '@faker-js/faker';

import { Bill } from '../entities/bill.entity';

export const generateFakeBill = (): Bill => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  amount: Number(faker.finance.amount({ min: 1000, max: 10000 })),
  groupId: faker.string.uuid(),
});

export const generateFakeBills = (amountOfBills = 2): Bill[] => {
  const users = [];

  for (let i = 0; i < amountOfBills; i++) {
    users.push(generateFakeBill());
  }

  return users;
};
