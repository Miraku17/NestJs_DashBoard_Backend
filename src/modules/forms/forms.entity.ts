import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyForm } from '../company-forms/company-forms.entity';

@Entity({ name: 'forms' })
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔹 CompanyForm (template, includes company)
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
