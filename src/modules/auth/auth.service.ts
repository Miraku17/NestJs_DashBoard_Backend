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

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.usersService.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      username: registerDto.username,
      email: registerDto.email,
      address: registerDto.address,
      phone: registerDto.phone,
      password: hashedPassword,
    });

    const userDto: UserDto = {
      id: newUser.data.id,
      firstName: newUser.data.firstName,
      lastName: newUser.data.lastName,
      username: newUser.data.username,
      email: newUser.data.email,
      address: newUser.data.address,
      phone: newUser.data.phone,
    };

    const token = this.generateToken(userDto);

    return {
      success: true,
      message: 'Registration successful',
      data: { user: userDto, access_token: token },
    };
  }

  // 🔹 Login existing user
  async login(loginDto: LoginDto) {
    const userResp = await this.usersService.findByUsername(loginDto.username);
    if (!userResp || !userResp.data) throw new UnauthorizedException('Invalid credentials');

    const user = userResp.data;
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

    return {
      success: true,
      message: 'Login successful',
      data: { user: userDto, access_token: token },
    };
  }

  // 🔹 Validate user from JWT payload
  async validateUser(payload: any) {
    const userResp = await this.usersService.findById(payload.sub);
    if (!userResp || !userResp.data) throw new UnauthorizedException('Invalid token');

    const user = userResp.data;
    const userDto: UserDto = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
    };

    return {
      success: true,
      message: 'User validated successfully',
      data: userDto,
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
