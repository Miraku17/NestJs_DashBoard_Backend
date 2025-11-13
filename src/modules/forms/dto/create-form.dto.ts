import { IsNotEmpty, IsOptional, IsString, IsUUID, IsInt, IsJSON } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFormDto {
  @ApiProperty({ 
    example: 'service', 
    description: 'Type of form, e.g., "service" or "commission"' 
  })
  @IsNotEmpty()
  @IsString()
  formType: string;

  @ApiPropertyOptional({ example: 'JO-12345', description: 'Optional job order reference' })
  @IsOptional()
  @IsString()
  jobOrder?: string;

  @ApiPropertyOptional({ example: 'Check all equipment', description: 'Optional remarks for the form' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiProperty({ example: 'a3f9c9f2-6d2e-4f2a-9b9a-123456789abc', description: 'Engine UUID this form belongs to' })
  @IsNotEmpty()
  @IsUUID()
  engineId: string;

  @ApiProperty({ example: 'b7d2e8f2-9c4f-4f2b-9b9a-abcdef123456', description: 'User UUID who fills the form' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 1, description: 'Company ID (integer)' })
  @IsNotEmpty()
  @IsInt()
  companyId: number;

  @ApiProperty({ example: 2, description: 'Company form template ID (integer)' })
  @IsNotEmpty()
  @IsInt()
  companyFormId: number;

  @ApiProperty({ 
    example: { field1: 'value1', field2: 'value2' }, 
    description: 'Dynamic JSON data for form fields' 
  })
  @IsNotEmpty()
  @IsJSON()
  data: any;
}
