import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyForm } from './company-forms.entity';
import { CreateCompanyFormDto } from './dto/create-company-form.dto';
import { UpdateCompanyFormDto } from './dto/update-company-form.dto';
import { Company } from '../companies/company.entity';

@Injectable()
export class CompanyFormsService {
  constructor(
    @InjectRepository(CompanyForm)
    private readonly companyFormRepository: Repository<CompanyForm>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // Create a new company form
  async create(dto: CreateCompanyFormDto) {
    const company = await this.companyRepository.findOne({
      where: { id: dto.companyId },
    });

    if (!company) {
      throw new NotFoundException(`Company with id ${dto.companyId} not found`);
    }

    const companyForm = this.companyFormRepository.create({
      name: dto.name,
      formType: dto.formType,
      company: company,
      fields: dto.fields,
    });

    const savedForm = await this.companyFormRepository.save(companyForm);
    return {
      success: true,
      message: 'Company form created successfully',
      data: savedForm,
    };
  }

  // Get all company forms
  async findAll() {
    const forms = await this.companyFormRepository.find({ relations: ['company'] });
    return {
      success: true,
      message: 'Company forms retrieved successfully',
      data: forms,
    };
  }

  // Get a single company form
  async findOne(id: number) {
    const companyForm = await this.companyFormRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!companyForm) throw new NotFoundException(`CompanyForm ${id} not found`);

    return {
      success: true,
      message: 'Company form retrieved successfully',
      data: companyForm,
    };
  }

  // Update a company form
  async update(id: number, dto: UpdateCompanyFormDto) {
    const companyForm = await this.findOne(id); // returns { success, message, data }
    Object.assign(companyForm.data, dto);
    const updatedForm = await this.companyFormRepository.save(companyForm.data);

    return {
      success: true,
      message: 'Company form updated successfully',
      data: updatedForm,
    };
  }

  // Delete a company form
  async remove(id: number) {
    const companyForm = await this.findOne(id); // returns { success, message, data }
    await this.companyFormRepository.remove(companyForm.data);

    return {
      success: true,
      message: 'Company form deleted successfully',
      data: null,
    };
  }
}
