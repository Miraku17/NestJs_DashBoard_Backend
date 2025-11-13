import { IsNotEmpty, IsString, IsJSON, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyFormDto {
  @ApiProperty({ example: 'Monthly Service Form', description: 'Name of the company form template' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'service', description: 'Type of form, e.g., "service" or "commission"' })
  @IsNotEmpty()
  @IsString()
  formType: string;

  @ApiProperty({ example: 1, description: 'Company ID that this form template belongs to' })
  @IsNotEmpty()
  @IsInt()
  companyId: number;

  @ApiProperty({
    example: [
      { fieldName: 'engineModel', fieldType: 'string', required: true },
      { fieldName: 'runHours', fieldType: 'number', required: true }
    ],
    description: 'JSON structure defining the fields of the template'
  })
  @IsNotEmpty()
  @IsJSON()
  fields: any;
}
