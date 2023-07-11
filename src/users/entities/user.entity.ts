import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Group } from 'src/groups/entities/group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  income: number;

  @ManyToMany(() => Group, (groups) => groups.users)
  groups?: Group[];

  @ManyToOne(() => Group, (group) => group.owner)
  ownedGroups?: Group[];
}
