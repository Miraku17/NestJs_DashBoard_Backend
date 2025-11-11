// customer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  equipment: string;

  @Column()
  customer: string;

  @Column()
  contactPerson: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  email?: string;
}
