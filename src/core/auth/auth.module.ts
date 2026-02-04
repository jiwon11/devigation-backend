import { Module } from '@nestjs/common';
import { LoginUseCase } from './command/login.usecase';
import { RefreshTokenUseCase } from './command/refresh-token.usecase';
import { AuthService } from './service/auth.service';

@Module({
  providers: [LoginUseCase, RefreshTokenUseCase, AuthService],
  exports: [LoginUseCase, RefreshTokenUseCase, AuthService],
})
export class AuthModule {}