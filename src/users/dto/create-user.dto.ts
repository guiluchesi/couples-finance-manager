import { FindOneOptions } from 'typeorm';

import { User } from '../entities/user.entity';

export type CreateUserDto = FindOneOptions<User>['where'] & {
  take?: number;
  skip?: number;
};
