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
  async create(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepository.create(createCompanyDto);
    const savedCompany = await this.companyRepository.save(company);
    return {
      success: true,
      message: 'Company created successfully',
      data: savedCompany,
    };
  }

  // Get all companies
  async findAll() {
    const companies = await this.companyRepository.find();
    return {
      success: true,
      message: 'Companies retrieved successfully',
      data: companies,
    };
  }

  // Get a single company by ID
  async findOne(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return {
      success: true,
      message: 'Company retrieved successfully',
      data: company,
    };
  }

  // Update a company by ID
  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id); // will throw if not found
    Object.assign(company.data, updateCompanyDto); // company.data because findOne now returns { success, message, data }
    const updatedCompany = await this.companyRepository.save(company.data);
    return {
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany,
    };
  }

  // Delete a company by ID
  async remove(id: number) {
    const company = await this.findOne(id); // will throw if not found
    await this.companyRepository.remove(company.data);
    return {
      success: true,
      message: 'Company deleted successfully',
      data: null,
    };
  }
}
