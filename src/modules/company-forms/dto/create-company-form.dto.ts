import { IsNotEmpty, IsString, IsJSON, IsInt } from 'class-validator';

export class CreateCompanyFormDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  formType: string; // "service" or "commission"

  @IsNotEmpty()
  @IsInt()
  companyId: number; // company to link

  @IsNotEmpty()
  @IsJSON()
  fields: any; // JSON structure for the template
}
