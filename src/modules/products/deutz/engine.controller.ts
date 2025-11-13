import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EngineService } from './engine.service';
import { CreateEngineDto } from './dto/create-engine.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Engines') // 👈 Groups all endpoints under "Engines"
@Controller('engines')
export class EngineController {
  constructor(private readonly engineService: EngineService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new engine' })
  @ApiBody({ type: CreateEngineDto })
  @ApiResponse({ status: 201, description: 'Engine created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() dto: CreateEngineDto) {
    const engine = await this.engineService.create(dto);
    return {
      status: 'success',
      message: 'Engine created successfully',
      data: engine,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all engines' })
  @ApiResponse({ status: 200, description: 'List of engines retrieved successfully', type: [CreateEngineDto] })
  async findAll() {
    const engines = await this.engineService.findAll();
    return {
      status: 'success',
      message: 'Engines retrieved successfully',
      data: engines,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an engine by ID' })
  @ApiParam({ name: 'id', description: 'Engine ID' })
  @ApiResponse({ status: 200, description: 'Engine retrieved successfully', type: CreateEngineDto })
  @ApiResponse({ status: 404, description: 'Engine not found' })
  async findOne(@Param('id') id: string) {
    const engine = await this.engineService.findOne(id);
    return {
      status: 'success',
      message: 'Engine retrieved successfully',
      data: engine,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an engine by ID' })
  @ApiParam({ name: 'id', description: 'Engine ID' })
  @ApiBody({ type: CreateEngineDto })
  @ApiResponse({ status: 200, description: 'Engine updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Engine not found' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateEngineDto>) {
    const engine = await this.engineService.update(id, dto);
    return {
      status: 'success',
      message: 'Engine updated successfully',
      data: engine,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an engine by ID' })
  @ApiParam({ name: 'id', description: 'Engine ID' })
  @ApiResponse({ status: 200, description: 'Engine deleted successfully' })
  @ApiResponse({ status: 404, description: 'Engine not found' })
  async remove(@Param('id') id: string) {
    await this.engineService.remove(id);
    return {
      status: 'success',
      message: 'Engine deleted successfully',
      data: null,
    };
  }
}
