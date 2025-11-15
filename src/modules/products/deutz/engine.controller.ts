import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EngineService } from './engine.service';
import { CreateEngineDto } from './dto/create-engine.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Engines')
@Controller('engines')
export class EngineController {
  constructor(private readonly engineService: EngineService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new engine' })
  @ApiBody({ type: CreateEngineDto })
  @ApiResponse({ status: 201, description: 'Engine created successfully' })
  async create(@Body() dto: CreateEngineDto) {
    return this.engineService.create(dto); // ✅ no wrapping
  }

  @Get()
  @ApiOperation({ summary: 'Get all engines' })
  async findAll() {
    return this.engineService.findAll(); // ✅ no wrapping
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an engine by ID' })
  @ApiParam({ name: 'id', description: 'Engine ID' })
  async findOne(@Param('id') id: string) {
    return this.engineService.findOne(id); // ✅ no wrapping
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an engine by ID' })
  @ApiParam({ name: 'id', description: 'Engine ID' })
  @ApiBody({ type: CreateEngineDto })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateEngineDto>) {
    return this.engineService.update(id, dto); // ✅ no wrapping
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an engine by ID' })
  @ApiParam({ name: 'id', description: 'Engine ID' })
  async remove(@Param('id') id: string) {
    return this.engineService.remove(id); // ✅ no wrapping
  }
}
