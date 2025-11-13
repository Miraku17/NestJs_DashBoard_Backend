import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Username of the registered user',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'strongpassword123',
    description: 'User password (minimum 8 characters)',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
