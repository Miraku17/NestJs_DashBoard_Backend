import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
@Controller('users') // base route: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  // GET /users/:id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDto | null> {
    return this.usersService.findById(id);
  }
}
