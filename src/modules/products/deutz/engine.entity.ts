import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Engine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  model: string;

  @Column()
  serialNo: string;

  @Column()
  altBrandModel: string;

  @Column()
  equipModel: string;

  @Column()
  equipSerialNo: string;

  @Column()
  altSerialNo: string;

  @Column()
  location: string;

  @Column()
  rating: string;

  @Column()
  rpm: string;

  @Column()
  startVoltage: string;

  @Column()
  runHours: string;

  @Column()
  fuelPumpSN: string;

  @Column()
  fuelPumpCode: string;

  @Column()
  lubeOil: string;

  @Column()
  fuelType: string;

  @Column()
  coolantAdditive: string;

  @Column()
  turboModel: string;

  @Column()
  turboSN: string;
}
