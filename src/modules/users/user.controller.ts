import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';

@Controller('users') // base route: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // GET /users/:id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(+id);
  }
}
