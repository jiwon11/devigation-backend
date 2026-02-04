import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  GITHUB = 'github',
  KAKAO = 'kakao',
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password!: string;
}

export class SocialLoginDto {
  @ApiProperty({ enum: AuthProvider })
  @IsEnum(AuthProvider)
  provider!: AuthProvider;

  @ApiProperty({ description: 'OAuth access token from provider' })
  @IsString()
  accessToken!: string;

  @ApiPropertyOptional({ description: 'OAuth refresh token from provider' })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken!: string;
}
