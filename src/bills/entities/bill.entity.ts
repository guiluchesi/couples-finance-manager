import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { Group } from 'src/groups/entities/group.entity';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Index('groupIdToBill')
  @Column('uuid')
  groupId: Group['id'];
}
