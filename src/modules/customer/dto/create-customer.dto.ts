import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'ABC Construction', description: 'Name of the customer' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Excavator X1', description: 'Equipment name or model' })
  @IsString()
  equipment: string;

  @ApiProperty({ example: 'ABC Corp', description: 'Customer company name' })
  @IsString()
  customer: string;

  @ApiProperty({ example: 'John Doe', description: 'Primary contact person for the customer' })
  @IsString()
  contactPerson: string;

  @ApiProperty({ example: '123 Main St, Manila, Philippines', description: 'Address of the customer' })
  @IsString()
  address: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Email address of the contact person' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
