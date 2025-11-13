import { IsNotEmpty, IsOptional, IsString, IsUUID, IsInt, IsJSON } from 'class-validator';

export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  formType: string; // e.g. "service" or "commission"

  @IsOptional()
  @IsString()
  jobOrder?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  // Foreign keys
  @IsNotEmpty()
  @IsUUID()
  engineId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsInt()
  companyId: number; // integer ID for company

  @IsNotEmpty()
  @IsInt()
  companyFormId: number; // link to the template

  @IsNotEmpty()
  @IsJSON()
  data: any; // dynamic filled values JSON
}
