import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  nickname: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}

interface User {
  id: string;
  email: string;
  nickname: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = this.users.find(user => user.email === dto.email);
    if (existingUser) {
      throw new ConflictException('邮箱已存在');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser: User = {
      id: Date.now().toString(),
      email: dto.email,
      nickname: dto.nickname,
      password: hashedPassword,
    };

    this.users.push(newUser);

    const accessToken = this.jwtService.sign({
      sub: newUser.id,
      email: newUser.email,
    });

    return {
      accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = this.users.find(user => user.email === dto.email);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    };
  }
}