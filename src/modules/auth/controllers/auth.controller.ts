import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService, LoginDto, RegisterDto, AuthResponse } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '邮箱或密码错误' })
  @ApiResponse({ status: 400, description: '参数无效' })
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '参数无效' })
  @ApiResponse({ status: 409, description: '邮箱已存在' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return await this.authService.register(dto);
  }
}