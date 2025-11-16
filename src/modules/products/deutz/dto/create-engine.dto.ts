import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEngineDto {
  @ApiProperty({ example: 'Model X1', description: 'Engine model name' })
  @IsString()
  model: string;

  @ApiProperty({ example: 'SN12345', description: 'Engine serial number' })
  @IsString()
  serialNo: string;

  @ApiProperty({ example: 'AltBrand X1', description: 'Alternative brand model' })
  @IsString()
  altBrandModel: string;

  @ApiProperty({ example: 'EquipModel X1', description: 'Equipment model' })
  @IsString()
  equipModel: string;

  @ApiProperty({ example: 'EQ12345', description: 'Equipment serial number' })
  @IsString()
  equipSerialNo: string;

  @ApiProperty({ example: 'AltSN123', description: 'Alternative serial number' })
  @IsString()
  altSerialNo: string;

  @ApiProperty({ example: 'Site A', description: 'Location of the engine' })
  @IsString()
  location: string;

  @ApiProperty({ example: '500kW', description: 'Rated power of the engine' })
  @IsString()
  rating: string;

  @ApiProperty({ example: '1500', description: 'Engine RPM' })
  @IsString()
  rpm: string;

  @ApiProperty({ example: '220V', description: 'Starting voltage' })
  @IsString()
  startVoltage: string;

  @ApiProperty({ example: '1200', description: 'Total run hours' })
  @IsString()
  runHours: string;

  @ApiProperty({ example: 'FP12345', description: 'Fuel pump serial number' })
  @IsString()
  fuelPumpSN: string;

  @ApiProperty({ example: 'FP-Code-X', description: 'Fuel pump code' })
  @IsString()
  fuelPumpCode: string;

  @ApiProperty({ example: 'SAE 40', description: 'Type of lube oil' })
  @IsString()
  lubeOil: string;

  @ApiProperty({ example: 'Diesel', description: 'Fuel type used' })
  @IsString()
  fuelType: string;

  @ApiProperty({ example: 'Coolant-X', description: 'Type of coolant additive' })
  @IsString()
  coolantAdditive: string;

  @ApiProperty({ example: 'TurboModel-X', description: 'Turbo model' })
  @IsString()
  turboModel: string;

  @ApiProperty({ example: 'TURBO123', description: 'Turbo serial number' })
  @IsString()
  turboSN: string;

  // 🔹 Company ID (number)
  @ApiProperty({ example: 1, description: 'ID of the company this engine belongs to' })
  @IsNumber()           // ✅ Add this for validation
  @Type(() => Number)   // ✅ Converts string → number from form-data
  companyId: number;
}
