import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EngineService } from './engine.service';
import { CreateEngineDto } from './dto/create-engine.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('Engines')
@Controller('engines')
export class EngineController {
  constructor(private readonly engineService: EngineService) {}

  // ✅ Create a new engine (optional image)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new engine with optional image' })
  @ApiBody({
    description: 'Engine data with optional image',
    schema: {
      type: 'object',
      properties: {
        model: { type: 'string' },
        serialNo: { type: 'string' },
        altBrandModel: { type: 'string' },
        equipModel: { type: 'string' },
        equipSerialNo: { type: 'string' },
        altSerialNo: { type: 'string' },
        location: { type: 'string' },
        rating: { type: 'string' },
        rpm: { type: 'string' },
        startVoltage: { type: 'string' },
        runHours: { type: 'string' },
        fuelPumpSN: { type: 'string' },
        fuelPumpCode: { type: 'string' },
        lubeOil: { type: 'string' },
        fuelType: { type: 'string' },
        coolantAdditive: { type: 'string' },
        turboModel: { type: 'string' },
        turboSN: { type: 'string' },
        companyId: { type: 'number' },
        image: { type: 'string', format: 'binary' }, // file upload
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Engine created successfully' })
  async create(@Body() dto: CreateEngineDto, @UploadedFile() file?: Express.Multer.File) {
    return this.engineService.create(dto, file);
  }

  // ✅ Get all engines
  @Get()
  @ApiOperation({ summary: 'Get all engines' })
  @ApiResponse({ status: 200, description: 'Engines retrieved successfully' })
  async findAll() {
    return this.engineService.findAll();
  }

  // ✅ Get a single engine by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get an engine by ID' })
  @ApiParam({ name: 'id', description: 'Engine ID' })
  @ApiResponse({ status: 200, description: 'Engine retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.engineService.findOne(id);
  }

  // ✅ Update engine with optional new image
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an engine by ID with optional image' })
  @ApiParam({ name: 'id', description: 'Engine ID' })
  @ApiBody({
    description: 'Engine data with optional image',
    schema: {
      type: 'object',
      properties: {
        model: { type: 'string' },
        serialNo: { type: 'string' },
        altBrandModel: { type: 'string' },
        equipModel: { type: 'string' },
        equipSerialNo: { type: 'string' },
        altSerialNo: { type: 'string' },
        location: { type: 'string' },
        rating: { type: 'string' },
        rpm: { type: 'string' },
        startVoltage: { type: 'string' },
        runHours: { type: 'string' },
        fuelPumpSN: { type: 'string' },
        fuelPumpCode: { type: 'string' },
        lubeOil: { type: 'string' },
        fuelType: { type: 'string' },
        coolantAdditive: { type: 'string' },
        turboModel: { type: 'string' },
        turboSN: { type: 'string' },
        companyId: { type: 'number' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateEngineDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.engineService.update(id, dto, file);
  }

  // ✅ Delete an engine
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an engine by ID' })
  @ApiParam({ name: 'id', description: 'Engine ID' })
  @ApiResponse({ status: 200, description: 'Engine deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.engineService.remove(id);
  }
}
