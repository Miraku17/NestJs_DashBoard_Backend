import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './forms.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { Company } from '../companies/company.entity';
import { CompanyForm } from '../company-forms/company-forms.entity';
import { Engine } from '../products/deutz/engine.entity';
import { Customer } from '../customer/customer.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(CompanyForm)
    private readonly companyFormRepository: Repository<CompanyForm>,

    @InjectRepository(Engine)
    private readonly engineRepository: Repository<Engine>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // ✅ Create a new form with auto-generated job order
  async create(dto: CreateFormDto) {
    const [companyForm, engine, customer] = await Promise.all([
      this.companyFormRepository.findOne({ where: { id: dto.companyFormId } }),
      this.engineRepository.findOne({ where: { id: dto.engineId } }),
      this.customerRepository.findOne({ where: { id: dto.customerId } }),
    ]);

    if (!companyForm) throw new NotFoundException('CompanyForm template not found');
    if (!engine) throw new NotFoundException('Engine not found');
    if (!customer) throw new NotFoundException('Customer not found');

    const form = this.formRepository.create({
      company: companyForm.company,
      companyForm,
      engine,
      customer,
      data: dto.data,
    });

    form.job_order = await this.generateJobOrder(form.company.name);

    const savedForm = await this.formRepository.save(form);

    return {
      success: true,
      message: 'Form created successfully',
      data: savedForm,
    };
  }

  // ✅ Auto-generate job order: PREFIX-YEAR-XXXX
  private async generateJobOrder(companyName: string): Promise<string> {
    const prefix = companyName.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();

    const lastForm = await this.formRepository
      .createQueryBuilder('form')
      .where('form.job_order LIKE :pattern', { pattern: `${prefix}-${year}-%` })
      .orderBy('form.dateCreated', 'DESC')
      .getOne();

    const nextNumber =
      lastForm && lastForm.job_order
        ? parseInt(lastForm.job_order.split('-')[2], 10) + 1
        : 1;

    return `${prefix}-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  // ✅ Find all forms with filtering, pagination, and sorting
  async findAll(
    filters: { jobOrder?: string; companyId?: number; engineId?: string } = {},
    page: number = 1,
    limit: number = 10,
  ) {
    const query = this.formRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.company', 'company')
      .leftJoinAndSelect('form.engine', 'engine')
      .leftJoinAndSelect('form.customer', 'customer')
      .leftJoinAndSelect('form.companyForm', 'companyForm');

    if (filters.jobOrder) query.andWhere('form.job_order LIKE :jobOrder', { jobOrder: `%${filters.jobOrder}%` });
    if (filters.companyId) query.andWhere('company.id = :companyId', { companyId: filters.companyId });
    if (filters.engineId) query.andWhere('engine.id = :engineId', { engineId: filters.engineId });

    const total = await query.getCount();
    const data = await query
      .orderBy('form.dateCreated', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      success: true,
      message: 'Forms retrieved successfully',
      data,
      total,
      page,
      limit,
    };
  }

  // ✅ Find one form by ID
  async findOne(id: string) {
    const form = await this.formRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.company', 'company')
      .leftJoinAndSelect('form.engine', 'engine')
      .leftJoinAndSelect('form.customer', 'customer')
      .leftJoinAndSelect('form.companyForm', 'companyForm')
      .where('form.id = :id', { id })
      .getOne();

    if (!form) throw new NotFoundException(`Form ${id} not found`);

    return {
      success: true,
      message: 'Form retrieved successfully',
      data: form,
    };
  }
}
