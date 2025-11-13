import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../companies/company.entity';
import { Engine } from '../products/deutz/engine.entity';
import { User } from '../users/user.entity';
import { CompanyForm } from '../company-forms/company-forms.entity';

@Entity({ name: 'forms' })
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  formType: string; // 'service' or 'commission'

  // 🔹 Company (integer ID)
  @ManyToOne(() => Company, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: number;

  // 🔹 Engine (UUID)
  @ManyToOne(() => Engine, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'engine_id' })
  engine: Engine;

  @Column({ type: 'uuid', nullable: true })
  engine_id: string;

  // 🔹 User (UUID)
  @ManyToOne(() => User, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  // 🔹 CompanyForm (template)
  @ManyToOne(() => CompanyForm, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_form_id' })
  companyForm: CompanyForm;

  @Column({ type: 'int', nullable: true })
  company_form_id: number;

  // 🔹 Job order
  @Column({ type: 'varchar', length: 50, nullable: true })
  job_order: string;

  // 🔹 Filled form data (dynamic JSON)
  @Column({ type: 'json', nullable: true })
  data: any;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @CreateDateColumn({ name: 'date_created' })
  dateCreated: Date;

  @UpdateDateColumn({ name: 'date_updated' })
  dateUpdated: Date;
}
