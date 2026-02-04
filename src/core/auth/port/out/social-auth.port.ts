import { AuthProvider } from '@domain/user/user.enum';

export const SOCIAL_AUTH = Symbol('SOCIAL_AUTH');

export interface SocialUserInfo {
  provider: AuthProvider;
  providerId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface SocialAuthPort {
  getAuthUrl(provider: AuthProvider, redirectUrl: string): string;
  getUserInfo(provider: AuthProvider, code: string): Promise<SocialUserInfo>;
}