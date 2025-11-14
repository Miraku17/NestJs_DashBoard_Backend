import { IsNotEmpty, IsOptional, IsString, IsUUID, IsInt, IsJSON } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFormDto {
  @ApiPropertyOptional({ example: 'JO-12345', description: 'Optional job order reference' })
  @IsOptional()
  @IsString()
  jobOrder?: string;

  @ApiProperty({ example: 'a3f9c9f2-6d2e-4f2a-9b9a-123456789abc', description: 'Engine UUID this form belongs to' })
  @IsNotEmpty()
  @IsUUID()
  engineId: string;

  @ApiProperty({ example: 'b7d2e8f2-9c4f-4f2b-9b9a-abcdef123456', description: 'Customer UUID who fills the form' })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

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
