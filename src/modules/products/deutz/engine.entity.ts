import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from 'src/modules/companies/company.entity';

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

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;
  
  // 🔹 Cloudinary Public ID
  @Column({ type: 'varchar', nullable: true })
  imagePublicId: string | null;

  // 🔹 Engine belongs to one company
  @ManyToOne(() => Company, { eager: true, onDelete: 'CASCADE' })
  company: Company;

  // 🔹 Auto timestamps
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
