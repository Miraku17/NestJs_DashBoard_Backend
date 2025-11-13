import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Form } from './forms.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { Company } from '../companies/company.entity';
import { CompanyForm } from '../company-forms/company-forms.entity';
import { Engine } from '../products/deutz/engine.entity';
import { User } from '../users/user.entity';

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

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ Create a new form with auto-generated job order
  async create(dto: CreateFormDto): Promise<Form> {
    const [company, companyForm, engine, user] = await Promise.all([
      this.companyRepository.findOne({ where: { id: dto.companyId } }),
      this.companyFormRepository.findOne({ where: { id: dto.companyFormId } }),
      this.engineRepository.findOne({ where: { id: dto.engineId } }),
      this.userRepository.findOne({ where: { id: dto.userId } }),
    ]);

    if (!company) throw new NotFoundException('Company not found');
    if (!companyForm) throw new NotFoundException('CompanyForm template not found');
    if (!engine) throw new NotFoundException('Engine not found');
    if (!user) throw new NotFoundException('User not found');

    const form = this.formRepository.create({
      company,
      company_id: company.id,
      companyForm,
      company_form_id: companyForm.id,
      engine,
      engine_id: engine.id,
      user,
      user_id: user.id,
      formType: dto.formType,
      data: dto.data,
      remarks: dto.remarks,
    });

    // Generate job order using company prefix
    form.job_order = await this.generateJobOrder(company.name);

    return this.formRepository.save(form);
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
    filters: {
      jobOrder?: string;
      formType?: string;
      companyId?: number;
      engineId?: string;
    } = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Form[]; total: number; page: number; limit: number }> {
    const query = this.formRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.company', 'company')
      .leftJoinAndSelect('form.engine', 'engine')
      .leftJoinAndSelect('form.user', 'user')
      .leftJoinAndSelect('form.companyForm', 'companyForm');

    // Apply filters
    if (filters.jobOrder) {
      query.andWhere('form.job_order LIKE :jobOrder', { jobOrder: `%${filters.jobOrder}%` });
    }
    if (filters.formType) {
      query.andWhere('form.formType = :formType', { formType: filters.formType });
    }
    if (filters.companyId) {
      query.andWhere('form.company = :companyId', { companyId: filters.companyId });
    }
    if (filters.engineId) {
      query.andWhere('form.engine = :engineId', { engineId: filters.engineId });
    }

    const total = await query.getCount();

    const data = await query
      .orderBy('form.dateCreated', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total, page, limit };
  }

  // ✅ Find one form by ID
  async findOne(id: string): Promise<Form> {
    const form = await this.formRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.company', 'company')
      .leftJoinAndSelect('form.engine', 'engine')
      .leftJoinAndSelect('form.user', 'user')
      .leftJoinAndSelect('form.companyForm', 'companyForm')
      .where('form.id = :id', { id })
      .getOne();

    if (!form) throw new NotFoundException(`Form ${id} not found`);
    return form;
  }
}
