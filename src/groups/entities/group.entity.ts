import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @JoinTable()
  @ManyToMany(() => User, (user) => user.groups)
  users?: User;

  @ManyToOne(() => User, (user) => user.ownedGroups)
  owner: User;
}
