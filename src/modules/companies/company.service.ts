// src/modules/companies/company.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // Create a new company
  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(createCompanyDto);
    return this.companyRepository.save(company);
  }

  // Get all companies
  async findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  // Get a single company by ID
  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  // Update a company by ID
  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id); // will throw if not found
    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  // Delete a company by ID
  async remove(id: number): Promise<void> {
    const company = await this.findOne(id); // will throw if not found
    await this.companyRepository.remove(company);
  }
}
