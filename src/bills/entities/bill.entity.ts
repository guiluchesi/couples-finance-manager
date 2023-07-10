import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  amount: number;
}
