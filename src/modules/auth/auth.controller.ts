import { 
  Controller, 
  Post, 
  Body, 
  UnauthorizedException 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication') // 👈 Groups all endpoints under "Authentication"
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 📝 Register a new user
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid registration data.' })
  @ApiBody({ type: RegisterDto }) // 👈 Show request body schema
  async register(@Body() createUserDto: RegisterDto) {
    return this.authService.register(createUserDto);
  }

  // 🔐 Login existing user
  @Post('login')
  @ApiOperation({ summary: 'Login a user and return JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful. Returns JWT token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    if (!token) throw new UnauthorizedException('Invalid credentials');
    return token;
  }
}
