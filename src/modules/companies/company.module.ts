// company.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
@Module({
  imports: [TypeOrmModule.forFeature([Company]),CloudinaryModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
