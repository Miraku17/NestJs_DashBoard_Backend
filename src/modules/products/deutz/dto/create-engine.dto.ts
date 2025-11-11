import { IsString } from 'class-validator';

export class CreateEngineDto {
  @IsString()
  model: string;

  @IsString()
  serialNo: string;

  @IsString()
  altBrandModel: string;

  @IsString()
  equipModel: string;

  @IsString()
  equipSerialNo: string;

  @IsString()
  altSerialNo: string;

  @IsString()
  location: string;

  @IsString()
  rating: string;

  @IsString()
  rpm: string;

  @IsString()
  startVoltage: string;

  @IsString()
  runHours: string;

  @IsString()
  fuelPumpSN: string;

  @IsString()
  fuelPumpCode: string;

  @IsString()
  lubeOil: string;

  @IsString()
  fuelType: string;

  @IsString()
  coolantAdditive: string;

  @IsString()
  turboModel: string;

  @IsString()
  turboSN: string;
}
