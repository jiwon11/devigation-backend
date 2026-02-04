import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth 로그인' })
  async githubAuth() {
    // Passport handles redirect
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth 콜백' })
  async githubAuthCallback(@Req() req: any, @Res() res: Response) {
    const { accessToken } = await this.authService.generateTokens(req.user.id);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth 로그인' })
  async googleAuth() {
    // Passport handles redirect
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth 콜백' })
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const { accessToken } = await this.authService.generateTokens(req.user.id);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
  }
}
