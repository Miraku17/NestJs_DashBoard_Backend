import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyFormDto } from './create-company-form.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanyFormDto extends PartialType(CreateCompanyFormDto) {
  @ApiPropertyOptional({ example: 'Monthly Service Form', description: 'Name of the company form template' })
  name?: string;

  @ApiPropertyOptional({ example: 'service', description: 'Type of form, e.g., "service" or "commission"' })
  formType?: string;

  @ApiPropertyOptional({ example: 1, description: 'Company ID that this form template belongs to' })
  companyId?: number;

  @ApiPropertyOptional({
    example: [
      { fieldName: 'engineModel', fieldType: 'string', required: true },
      { fieldName: 'runHours', fieldType: 'number', required: true }
    ],
    description: 'JSON structure defining the fields of the template'
  })
  fields?: any;
}
