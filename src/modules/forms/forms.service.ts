import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './forms.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { CompanyForm } from '../company-forms/company-forms.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,

    @InjectRepository(CompanyForm)
    private readonly companyFormRepository: Repository<CompanyForm>,
  ) {}

  // Deep merge helper for partial update
  private deepMerge(target: any, source: any) {
    for (const key of Object.keys(source)) {
      if (
        source[key] instanceof Object &&
        key in target &&
        target[key] instanceof Object
      ) {
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  // Create a new form with auto-generated job order
  async create(dto: CreateFormDto) {
    const companyForm = await this.companyFormRepository.findOne({
      where: { id: dto.companyFormId },
      relations: ['company'],
    });

    if (!companyForm)
      throw new NotFoundException('CompanyForm template not found');

    const form = this.formRepository.create({
      companyForm,
      data: dto.data,
    });

    form.job_order = await this.generateJobOrder(companyForm.company.name);
    const savedForm = await this.formRepository.save(form);

    return {
      success: true,
      message: 'Form created successfully',
      data: savedForm,
    };
  }

  // Generate job order: PREFIX-YEAR-XXXX
  private async generateJobOrder(companyName: string): Promise<string> {
    const prefix = companyName.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();

    const lastForm = await this.formRepository
      .createQueryBuilder('form')
      .where('form.job_order LIKE :pattern', { pattern: `${prefix}-${year}-%` })
      .orderBy('form.dateCreated', 'DESC')
      .getOne();

    const nextNumber =
      lastForm?.job_order
        ? parseInt(lastForm.job_order.split('-')[2], 10) + 1
        : 1;

    return `${prefix}-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  // Find all with filtering
  async findAll(filters: { jobOrder?: string; companyFormId?: string } = {}, page = 1, limit = 10) {
    const query = this.formRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.companyForm', 'companyForm');

    if (filters.jobOrder) {
      query.andWhere('form.job_order LIKE :jobOrder', {
        jobOrder: `%${filters.jobOrder}%`,
      });
    }

    if (filters.companyFormId) {
      query.andWhere('companyForm.id = :companyFormId', {
        companyFormId: filters.companyFormId,
      });
    }

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

  // Find one
  async findOne(id: string) {
    const form = await this.formRepository.findOne({
      where: { id },
      relations: ['companyForm'],
    });

    console.log("This is running");

    if (!form) throw new NotFoundException(`Form ${id} not found`);

    return {
      success: true,
      message: 'Form retrieved successfully',
      data: form,
    };
  }

  // Update (FULL partial update support)
  async update(id: string, dto: Partial<CreateFormDto>) {
    const formResp = await this.findOne(id);
    const form = formResp.data;

    // Updating companyFormId?
    if (dto.companyFormId) {
      const companyForm = await this.companyFormRepository.findOne({
        where: { id: dto.companyFormId },
        relations: ['company'],
      });

      if (!companyForm)
        throw new NotFoundException('CompanyForm template not found');

      form.companyForm = companyForm;
      form.job_order = await this.generateJobOrder(companyForm.company.name);

      delete dto.companyFormId;
    }

    // Partial update of nested JSON
    if (dto.data) {
      form.data = this.deepMerge(form.data ?? {}, dto.data);
    }

    const updatedForm = await this.formRepository.save(form);

    return {
      success: true,
      message: 'Form updated successfully',
      data: updatedForm,
    };
  }

  // Delete
  async remove(id: string) {
    const formResp = await this.findOne(id);
    const form = formResp.data;

    await this.formRepository.remove(form);

    return {
      success: true,
      message: 'Form deleted successfully',
      data: null,
    };
  }
}
