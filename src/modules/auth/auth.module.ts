import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'novel-ai-secret-key-2024',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
