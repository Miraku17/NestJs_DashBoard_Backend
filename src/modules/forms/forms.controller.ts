import { Controller, Get, Post, Param, Body, Query, ParseUUIDPipe } from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Forms') // 👈 Groups all form-related endpoints
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new form' })
  @ApiBody({ type: CreateFormDto })
  @ApiResponse({ status: 201, description: 'Form created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() dto: CreateFormDto) {
    return this.formsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all forms with optional filters' })
  @ApiQuery({ name: 'jobOrder', required: false, description: 'Filter by job order', type: String })
  @ApiQuery({ name: 'formType', required: false, description: 'Filter by form type', type: String })
  @ApiQuery({ name: 'companyId', required: false, description: 'Filter by company ID', type: Number })
  @ApiQuery({ name: 'engineId', required: false, description: 'Filter by engine UUID', type: String })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'List of forms retrieved successfully' })
  findAll(
    @Query('jobOrder') jobOrder?: string,
    @Query('formType') formType?: string,
    @Query('companyId') companyId?: string,
    @Query('engineId') engineId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.formsService.findAll(
      {
        jobOrder,
        formType,
        companyId: companyId ? parseInt(companyId, 10) : undefined,
        engineId,
      },
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form by ID' })
  @ApiParam({ name: 'id', description: 'Form UUID' })
  @ApiResponse({ status: 200, description: 'Form retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.formsService.findOne(id);
  }
}
