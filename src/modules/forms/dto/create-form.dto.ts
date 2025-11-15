import { IsNotEmpty, IsOptional, IsString, IsInt, IsJSON } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFormDto {
  @ApiPropertyOptional({ example: 'JO-12345', description: 'Optional job order reference' })
  @IsOptional()
  @IsString()
  jobOrder?: string;

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
