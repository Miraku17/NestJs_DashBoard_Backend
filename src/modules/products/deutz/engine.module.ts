import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineController } from './engine.controller';
import { Engine } from './engine.entity';
import { EngineService } from './engine.service';
import { Company } from 'src/modules/companies/company.entity';
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Engine, Company]),
    CloudinaryModule, // ✅ add this
  ],
  providers: [EngineService],
  controllers: [EngineController],
})
export class EngineModule {}
