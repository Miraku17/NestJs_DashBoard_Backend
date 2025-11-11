import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineController } from './engine.controller';
import { Engine } from './engine.entity';
import { EngineService } from './engine.service';

@Module({
  imports: [TypeOrmModule.forFeature([Engine])],
  providers: [EngineService],
  controllers: [EngineController],
})
export class EngineModule {}
