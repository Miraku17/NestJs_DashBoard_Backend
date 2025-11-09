import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '../users/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 🔹 Register a new user
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByUsername(registerDto.username);
    if (existingUser) throw new UnauthorizedException('Username already taken');

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user in DB
    const newUser = await this.usersService.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      username: registerDto.username,
      email: registerDto.email,
      address: registerDto.address,
      phone: registerDto.phone,
      password: hashedPassword,
    });

    // Map to DTO
    const userDto: UserDto = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      email: newUser.email,
      address: newUser.address,
      phone: newUser.phone,
    };

    // Generate token
    const token = this.generateToken(userDto);

    return { user: userDto, access_token: token };
  }

  // 🔹 Login existing user
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const userDto: UserDto = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
    };

    const token = this.generateToken(userDto);
    return { user: userDto, access_token: token };
  }

  // 🔹 Validate user from JWT payload
  async validateUser(payload: any): Promise<UserDto> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Invalid token');

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
    };
  }

  // 🔹 Generate JWT
  private generateToken(user: UserDto): string {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: ['user'],
    };
    return this.jwtService.sign(payload);
  }
}
