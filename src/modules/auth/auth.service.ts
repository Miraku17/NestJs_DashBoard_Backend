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

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) throw new UnauthorizedException('User with this email already exists');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const userDto: UserDto = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    const token = this.generateToken(userDto);

    return { user: userDto, access_token: token };
  }

  async login(loginDto: LoginDto) {
    // Fetch full entity (includes password)
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
  
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
  
    // Map to DTO before returning
    const userDto: UserDto = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  
    const token = this.generateToken(userDto);
  
    return { user: userDto, access_token: token };
  }
  
  

  async validateUser(payload: any): Promise<UserDto> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Invalid token');

    return { id: user.id, name: user.name, email: user.email };
  }

  private generateToken(user: UserDto): string {
    const payload = { email: user.email, sub: user.id, roles: ['user'] };
    return this.jwtService.sign(payload);
  }
}
