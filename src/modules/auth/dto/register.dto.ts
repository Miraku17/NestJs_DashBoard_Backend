import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address (must be unique)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'strongpassword123',
    description: 'Password (minimum 8 characters)',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username for login' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: '123 Main St, Manila, Philippines', description: 'Home address' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: '+63 912 345 6789', description: 'User phone number' })
  @IsNotEmpty()
  @IsString()
  phone: string;
}
