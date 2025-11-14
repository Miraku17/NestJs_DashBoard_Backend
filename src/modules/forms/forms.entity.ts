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
import { Customer } from '../customer/customer.entity';
import { CompanyForm } from '../company-forms/company-forms.entity';

@Entity({ name: 'forms' })
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔹 Company (relationship only)
  @ManyToOne(() => Company, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // 🔹 Engine
  @ManyToOne(() => Engine, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'engine_id' })
  engine: Engine;

  // 🔹 Customer
  @ManyToOne(() => Customer, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  // 🔹 CompanyForm (template)
  @ManyToOne(() => CompanyForm, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_form_id' })
  companyForm: CompanyForm;

  // 🔹 Job order
  @Column({ type: 'varchar', length: 50, nullable: true })
  job_order: string;

  // 🔹 Filled form data (dynamic JSON)
  @Column({ type: 'json', nullable: true })
  data: any;

  @CreateDateColumn({ name: 'date_created' })
  dateCreated: Date;

  @UpdateDateColumn({ name: 'date_updated' })
  dateUpdated: Date;
}
