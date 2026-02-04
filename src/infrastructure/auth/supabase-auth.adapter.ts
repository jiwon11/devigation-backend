import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenProviderPort, TokenPayload, TokenPair } from '@core/auth/port/out/token-provider.port';
import { SocialAuthPort, SocialUserInfo } from '@core/auth/port/out/social-auth.port';
import { AuthProvider } from '@domain/user/user.enum';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';

@Injectable()
export class SupabaseAuthAdapter implements TokenProviderPort, SocialAuthPort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async generateTokens(payload: TokenPayload): Promise<TokenPair> {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload | null> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token);
      return payload;
    } catch {
      return null;
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload | null> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token);
      return payload;
    } catch {
      return null;
    }
  }

  async revokeRefreshToken(_token: string): Promise<void> {
    // Implementation for token revocation
  }

  getAuthUrl(provider: AuthProvider, redirectUrl: string): string {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    return `${supabaseUrl}/auth/v1/authorize?provider=${provider.toLowerCase()}&redirect_to=${encodeURIComponent(redirectUrl)}`;
  }

  async getUserInfo(provider: AuthProvider, code: string): Promise<SocialUserInfo> {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.exchangeCodeForSession(code);

    if (error !== null || data.user === null) {
      throw new Error('Failed to exchange code for session');
    }

    const user = data.user;
    return {
      provider,
      providerId: user.id,
      email: user.email ?? '',
      name: user.user_metadata?.['full_name'] as string | null ?? null,
      avatarUrl: user.user_metadata?.['avatar_url'] as string | null ?? null,
    };
  }
}