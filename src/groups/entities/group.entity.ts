import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Bill } from 'src/bills/entities/bill.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @JoinTable()
  @ManyToMany(() => User, (user) => user.groups)
  users?: User[];

  @ManyToOne(() => User, (user) => user.ownedGroups)
  owner: User;

  @OneToMany(() => Bill, (bill) => bill.groupId)
  bills?: Bill[];
}
