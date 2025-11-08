import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param registerDto User registration data
   * @returns Newly created user (without password) and access token
   */
  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }
    
    // Hash the password
    const hashedPassword = await this.hashPassword(registerDto.password);
    
    // Create a new user
    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    
    // Generate token
    const token = this.generateToken(newUser);
    
    // Remove password from response
    const { password, ...result } = newUser;
    
    // Return user data and token
    return {
      user: result,
      access_token: token,
    };
  }

  /**
   * Login an existing user
   * @param loginDto Login credentials
   * @returns User data (without password) and access token
   */
  async login(loginDto: LoginDto) {
    // Find the user by email
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Verify password
    const isPasswordValid = await this.comparePasswords(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Generate token
    const token = this.generateToken(user);
    
    // Remove password from response
    const { password, ...result } = user;
    
    // Return user data and token
    return {
      user: result,
      access_token: token,
    };
  }

  /**
   * Validate user for JWT strategy
   * @param payload JWT payload
   * @returns User without password
   */
  async validateUser(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    
    // Remove password from response
    const { password, ...result } = user;
    return result;
  }

  /**
   * Generate JWT token
   * @param user User data
   * @returns JWT token
   */
  private generateToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.id, // Use user ID as subject
      roles: user.roles || ['user'], // Default role if none specified
    };
    
    return this.jwtService.sign(payload);
  }

  /**
   * Hash a password using bcrypt
   * @param password Plain text password
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare a plain text password with a hashed password
   * @param password Plain text password
   * @param hashedPassword Hashed password
   * @returns Whether passwords match
   */
  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}