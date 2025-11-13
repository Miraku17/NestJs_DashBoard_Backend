import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CompanyFormsService } from './company-forms.service';
import { CreateCompanyFormDto } from './dto/create-company-form.dto';
import { UpdateCompanyFormDto } from './dto/update-company-form.dto';

@Controller('company-forms')
export class CompanyFormsController {
  constructor(private readonly service: CompanyFormsService) {}

  @Post()
  create(@Body() dto: CreateCompanyFormDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyFormDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
