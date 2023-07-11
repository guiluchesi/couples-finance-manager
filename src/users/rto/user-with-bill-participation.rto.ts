import { User } from '../entities/user.entity';

export type UserWithBillParticipationRto = User & {
  billParticipation: number;
};
