import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // ✅ Create a new user
  async create(userData: Partial<User>) {
    const user = this.userRepo.create(userData);
    const savedUser = await this.userRepo.save(user);

    return {
      success: true,
      message: 'User created successfully',
      data: savedUser,
    };
  }

  // ✅ Find user by email
  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return null;
    return {
      success: true,
      message: 'User found',
      data: user,
    };
  }

  // ✅ Find user by username
  async findByUsername(username: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) return null;
    return {
      success: true,
      message: 'User found',
      data: user,
    };
  }

  // ✅ Find user by ID
  async findById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  // ✅ Get all users
  async findAll() {
    const users = await this.userRepo.find();
    const userDtos: UserDto[] = users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
    }));

    return {
      success: true,
      message: 'Users retrieved successfully',
      data: userDtos,
    };
  }
}
