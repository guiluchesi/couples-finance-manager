import { Group } from 'src/groups/entities/group.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

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
