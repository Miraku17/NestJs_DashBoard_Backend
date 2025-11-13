import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Company } from '../companies/company.entity';
  
  @Entity('company_forms')
  export class CompanyForm {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 100 })
    name: string; // e.g., "Service Form", "Commission Form"
  
    @Column({ type: 'varchar', length: 50 })
    formType: string; // "service" or "commission"
  
    @ManyToOne(() => Company, { eager: true })
    company: Company; // link to the company
  
    @Column('json', { nullable: true })
    fields: any; // JSON object defining the template fields
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  }
  