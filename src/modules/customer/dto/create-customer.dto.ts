// dto/create-customer.dto.ts
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsString()
  equipment: string;

  @IsString()
  customer: string;

  @IsString()
  contactPerson: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
