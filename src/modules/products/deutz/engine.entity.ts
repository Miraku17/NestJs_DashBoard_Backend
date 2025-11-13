import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Form } from 'src/modules/forms/forms.entity';
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


  // ✅ Relationship: one engine can have many forms
  @OneToMany(() => Form, (form) => form.engine)
  forms: Form[];

  // ✅ Auto timestamps
  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
