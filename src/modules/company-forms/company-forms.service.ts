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

  async create(dto: CreateCompanyFormDto): Promise<CompanyForm> {
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

    return this.companyFormRepository.save(companyForm);
  }

  async findAll(): Promise<CompanyForm[]> {
    return this.companyFormRepository.find({ relations: ['company'] });
  }

  async findOne(id: number): Promise<CompanyForm> {
    const companyForm = await this.companyFormRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!companyForm) throw new NotFoundException(`CompanyForm ${id} not found`);
    return companyForm;
  }

  async update(id: number, dto: UpdateCompanyFormDto): Promise<CompanyForm> {
    const companyForm = await this.findOne(id);

    Object.assign(companyForm, dto);

    return this.companyFormRepository.save(companyForm);
  }

  async remove(id: number): Promise<void> {
    const companyForm = await this.findOne(id);
    await this.companyFormRepository.remove(companyForm);
  }
}
