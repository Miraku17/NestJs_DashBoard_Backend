import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyFormDto } from './create-company-form.dto';

export class UpdateCompanyFormDto extends PartialType(CreateCompanyFormDto) {}
