import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { Form } from './forms.entity';
import { CompanyForm } from '../company-forms/company-forms.entity';
import { Company } from '../companies/company.entity';
import { Engine } from '../products/deutz/engine.entity';
import { CustomerModule } from '../customer/customer.module'; // ✅ import CustomerModule

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Form,
      CompanyForm,
      Company,
      Engine,
    ]),
    CustomerModule, 
  ],
  providers: [FormsService],
  controllers: [FormsController],
})
export class FormsModule {}
