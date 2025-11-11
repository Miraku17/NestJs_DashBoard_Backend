import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EngineService } from './engine.service';
import { CreateEngineDto } from './dto/create-engine.dto';


@Controller('engines')
export class EngineController {
  constructor(private readonly engineService: EngineService) {}

  @Post()
  async create(@Body() dto: CreateEngineDto) {
    const engine = await this.engineService.create(dto);
    return {
      status: 'success',
      message: 'Engine created successfully',
      data: engine,
    };
  }

  @Get()
  async findAll() {
    const engines = await this.engineService.findAll();
    return {
      status: 'success',
      message: 'Engines retrieved successfully',
      data: engines,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const engine = await this.engineService.findOne(id);
    return {
      status: 'success',
      message: 'Engine retrieved successfully',
      data: engine,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateEngineDto>) {
    const engine = await this.engineService.update(id, dto);
    return {
      status: 'success',
      message: 'Engine updated successfully',
      data: engine,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.engineService.remove(id);
    return {
      status: 'success',
      message: 'Engine deleted successfully',
      data: null,
    };
  }
}
