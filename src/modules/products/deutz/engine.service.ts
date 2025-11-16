import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Engine } from './engine.entity';
import { CreateEngineDto } from './dto/create-engine.dto';
import { Company } from 'src/modules/companies/company.entity';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';

@Injectable()
export class EngineService {
  constructor(
    @InjectRepository(Engine)
    private engineRepo: Repository<Engine>,

    @InjectRepository(Company)
    private companyRepo: Repository<Company>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ✅ Create a new engine with optional image
  async create(dto: CreateEngineDto, file?: Express.Multer.File) {
    const company = await this.companyRepo.findOne({
      where: { id: dto.companyId },
    });
    if (!company) throw new NotFoundException('Company not found');

    let imageUrl = '';
    let imagePublicId = '';
    

    if (file) {
      const uploaded = await this.cloudinaryService.uploadImage(
        file,
        `engines/company_${dto.companyId}`,
      );
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    const engine = this.engineRepo.create({
      ...dto,
      company,
      imageUrl,
      imagePublicId,
    });

    const savedEngine = await this.engineRepo.save(engine);

    return {
      success: true,
      message: 'Engine created successfully',
      data: savedEngine,
    };
  }

  // ✅ Get all engines
  async findAll() {
    const engines = await this.engineRepo.find({ relations: ['company'] });
    const total = await this.engineRepo.count();

    return {
      success: true,
      message: 'Engines retrieved successfully',
      total,
      data: engines,
    };
  }

  // ✅ Get a single engine by ID
  async findOne(id: string) {
    const engine = await this.engineRepo.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!engine) throw new NotFoundException('Engine not found');
    return {
      success: true,
      message: 'Engine retrieved successfully',
      data: engine,
    };
  }

  // ✅ Update an engine with optional new image
  async update(id: string, dto: Partial<CreateEngineDto>, file?: Express.Multer.File) {
    const engineResp = await this.findOne(id);
    const engine = engineResp.data;

    // Update company if provided
    if (dto.companyId) {
      const company = await this.companyRepo.findOne({
        where: { id: dto.companyId },
      });
      if (!company) throw new NotFoundException('Company not found');
      engine.company = company;
      delete dto.companyId;
    }

    // If new image is uploaded
    if (file) {
      // Delete old image from Cloudinary if exists
      if (engine.imagePublicId) {
        await this.cloudinaryService.deleteImage(engine.imagePublicId);
      }

      const uploaded = await this.cloudinaryService.uploadImage(
        file,
        `engines/company_${engine.company.id}`,
      );
      engine.imageUrl = uploaded.secure_url;
      engine.imagePublicId = uploaded.public_id;
    }

    Object.assign(engine, dto);
    const updatedEngine = await this.engineRepo.save(engine);

    return {
      success: true,
      message: 'Engine updated successfully',
      data: updatedEngine,
    };
  }

  // ✅ Delete an engine and its image
  async remove(id: string) {
    const engineResp = await this.findOne(id);
    const engine = engineResp.data;

    // Delete image from Cloudinary if exists
    if (engine.imagePublicId) {
      await this.cloudinaryService.deleteImage(engine.imagePublicId);
    }

    await this.engineRepo.remove(engine);

    return {
      success: true,
      message: 'Engine deleted successfully',
      data: null,
    };
  }
}
