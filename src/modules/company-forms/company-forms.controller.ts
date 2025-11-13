import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CompanyFormsService } from './company-forms.service';
import { CreateCompanyFormDto } from './dto/create-company-form.dto';
import { UpdateCompanyFormDto } from './dto/update-company-form.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Company Forms') // 👈 Groups all endpoints under "Company Forms"
@Controller('company-forms')
export class CompanyFormsController {
  constructor(private readonly service: CompanyFormsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company form template' })
  @ApiBody({ type: CreateCompanyFormDto })
  @ApiResponse({ status: 201, description: 'Company form created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() dto: CreateCompanyFormDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all company form templates' })
  @ApiResponse({ status: 200, description: 'List of company forms retrieved successfully', type: [CreateCompanyFormDto] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company form template by ID' })
  @ApiParam({ name: 'id', description: 'Company form template ID' })
  @ApiResponse({ status: 200, description: 'Company form retrieved successfully', type: CreateCompanyFormDto })
  @ApiResponse({ status: 404, description: 'Company form not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company form template by ID' })
  @ApiParam({ name: 'id', description: 'Company form template ID' })
  @ApiBody({ type: UpdateCompanyFormDto })
  @ApiResponse({ status: 200, description: 'Company form updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Company form not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyFormDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company form template by ID' })
  @ApiParam({ name: 'id', description: 'Company form template ID' })
  @ApiResponse({ status: 200, description: 'Company form deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company form not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
