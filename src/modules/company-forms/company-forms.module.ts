import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyFormsService } from './company-forms.service';
import { CompanyFormsController } from './company-forms.controller';
import { CompanyForm } from './company-forms.entity';
import { Company } from '../companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyForm, Company])],
  providers: [CompanyFormsService],
  controllers: [CompanyFormsController],
})
export class CompanyFormsModule {}
