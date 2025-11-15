import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Customer } from '../customer/customer.entity';
import { Engine } from '../products/deutz/engine.entity';
import { Company } from '../companies/company.entity';
import { CompanyForm } from '../company-forms/company-forms.entity';
import { Form } from '../forms/forms.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Customer, Engine, Company, CompanyForm, Form])
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService, DatabaseService],
})
export class ChatbotModule {}
