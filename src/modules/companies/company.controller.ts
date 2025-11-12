// customer.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';


@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  findAll(){
    return this.companyService.findAll();
  }

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto){
    
    const company = await this.companyService.create(createCompanyDto)
    return {
      status: 'success',
      message: 'Company created successfully',
      data: company,
    };
  }

  @Get(':id')
  findOne(@Param('id') id:number){
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.companyService.remove(+id);
  }

}
