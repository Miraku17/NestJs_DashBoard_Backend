import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineController } from './engine.controller';
import { Engine } from './engine.entity';
import { EngineService } from './engine.service';
import { Company } from 'src/modules/companies/company.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Engine, Company]), 
  ],
  providers: [EngineService],
  controllers: [EngineController],
})
export class EngineModule {}
