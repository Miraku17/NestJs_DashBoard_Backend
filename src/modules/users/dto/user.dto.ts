import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '1', description: 'Unique user ID' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  lastName: string;

  @ApiProperty({ example: '123 Main St, Manila, Philippines', description: 'Home address of the user' })
  address: string;

  @ApiProperty({ example: '+63 912 345 6789', description: 'Phone number of the user' })
  phone: string;

  @ApiProperty({ example: 'johndoe', description: 'Username of the user' })
  username: string;
}
