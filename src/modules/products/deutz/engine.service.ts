import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Engine } from './engine.entity';
import { CreateEngineDto } from './dto/create-engine.dto';
import { Company } from 'src/modules/companies/company.entity';
@Injectable()
export class EngineService {
  constructor(
    @InjectRepository(Engine)
    private engineRepo: Repository<Engine>,

    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) {}

  // ✅ Create a new engine with company
  async create(dto: CreateEngineDto) {
    // Find company
    const company = await this.companyRepo.findOne({
      where: { id: dto.companyId },
    });
    if (!company) throw new NotFoundException('Company not found');

    const engine = this.engineRepo.create({
      ...dto,
      company,
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

  // ✅ Update an engine
  async update(id: string, dto: Partial<CreateEngineDto>) {
    const engineResp = await this.findOne(id); // returns { success, message, data }
    const engine = engineResp.data;

    // If updating companyId
    if (dto.companyId) {
      const company = await this.companyRepo.findOne({
        where: { id: dto.companyId },
      });
      if (!company) throw new NotFoundException('Company not found');
      engine.company = company;
      delete dto.companyId; // Remove from dto to avoid assigning to engine directly
    }

    Object.assign(engine, dto);
    const updatedEngine = await this.engineRepo.save(engine);

    return {
      success: true,
      message: 'Engine updated successfully',
      data: updatedEngine,
    };
  }

  // ✅ Delete an engine
  async remove(id: string) {
    const engineResp = await this.findOne(id); // returns { success, message, data }
    const engine = engineResp.data;
    await this.engineRepo.remove(engine);
    return {
      success: true,
      message: 'Engine deleted successfully',
      data: null,
    };
  }
}
