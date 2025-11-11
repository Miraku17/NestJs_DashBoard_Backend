import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Engine } from './engine.entity';
import { CreateEngineDto } from './dto/create-engine.dto';

@Injectable()
export class EngineService {
  constructor(
    @InjectRepository(Engine)
    private engineRepo: Repository<Engine>,
  ) {}

  async create(dto: CreateEngineDto): Promise<Engine> {
    const engine = this.engineRepo.create(dto);
    return this.engineRepo.save(engine);
  }

  async findAll(): Promise<Engine[]> {
    return this.engineRepo.find();
  }

  async findOne(id: string): Promise<Engine> {
    const engine = await this.engineRepo.findOne({ where: { id } });
    if (!engine) throw new NotFoundException('Engine not found');
    return engine;
  }

  async update(id: string, dto: Partial<CreateEngineDto>): Promise<Engine> {
    const engine = await this.findOne(id);
    Object.assign(engine, dto);
    return this.engineRepo.save(engine);
  }

  async remove(id: string): Promise<void> {
    const engine = await this.findOne(id);
    await this.engineRepo.remove(engine);
  }
}
