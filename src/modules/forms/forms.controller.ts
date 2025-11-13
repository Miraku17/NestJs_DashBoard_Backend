import { Controller, Get, Post, Param, Body, Query, ParseUUIDPipe } from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  create(@Body() dto: CreateFormDto) {
    return this.formsService.create(dto);
  }

  @Get()
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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.formsService.findOne(id);
  }
}
