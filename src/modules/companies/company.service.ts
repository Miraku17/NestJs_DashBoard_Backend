// src/modules/companies/company.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ✅ Create a new company with optional image
  async create(createCompanyDto: CreateCompanyDto, file?: Express.Multer.File) {
    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (file) {
      const uploaded = await this.cloudinaryService.uploadImage(file, `companies`);
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    const company = this.companyRepository.create({
      ...createCompanyDto,
      imageUrl,
      imagePublicId,
    });

    const savedCompany = await this.companyRepository.save(company);

    return {
      success: true,
      message: 'Company created successfully',
      data: savedCompany,
    };
  }

  // ✅ Get all companies
  async findAll() {
    const companies = await this.companyRepository.find();
    const total = await this.companyRepository.count();
    return {
      success: true,
      message: 'Companies retrieved successfully',
      total,
      data: companies,
    };
  }

  // ✅ Get a single company by ID
  async findOne(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new NotFoundException(`Company with ID ${id} not found`);
    return {
      success: true,
      message: 'Company retrieved successfully',
      data: company,
    };
  }

  // ✅ Update a company with optional new image
  async update(id: number, updateCompanyDto: UpdateCompanyDto, file?: Express.Multer.File) {
    const resp = await this.findOne(id);
    const company = resp.data;

    // If a new image is uploaded, delete old one and upload new
    if (file) {
      if (company.imagePublicId) {
        await this.cloudinaryService.deleteImage(company.imagePublicId);
      }
      const uploaded = await this.cloudinaryService.uploadImage(file, `companies`);
      company.imageUrl = uploaded.secure_url;
      company.imagePublicId = uploaded.public_id;
    }

    Object.assign(company, updateCompanyDto);

    const updatedCompany = await this.companyRepository.save(company);

    return {
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany,
    };
  }

  // ✅ Delete a company and its image
  async remove(id: number) {
    const resp = await this.findOne(id);
    const company = resp.data;

    if (company.imagePublicId) {
      await this.cloudinaryService.deleteImage(company.imagePublicId);
    }

    await this.companyRepository.remove(company);

    return {
      success: true,
      message: 'Company deleted successfully',
      data: null,
    };
  }
}
