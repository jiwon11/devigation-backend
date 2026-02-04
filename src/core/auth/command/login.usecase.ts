import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { User } from '@domain/user/user';
import { LoginCommand } from './login.command';
import { USER_REPOSITORY, UserRepositoryPort } from '@core/user/port/out/user-repository.port';
import { TOKEN_PROVIDER, TokenProviderPort, TokenPair } from '../port/out/token-provider.port';
import { SOCIAL_AUTH, SocialAuthPort } from '../port/out/social-auth.port';

export interface LoginResult {
  user: User;
  tokens: TokenPair;
  isNewUser: boolean;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(TOKEN_PROVIDER)
    private readonly tokenProvider: TokenProviderPort,
    @Inject(SOCIAL_AUTH)
    private readonly socialAuth: SocialAuthPort,
  ) {}

  async execute(command: LoginCommand): Promise<Result<LoginResult, Error>> {
    try {
      // Get user info from social provider
      const socialUserInfo = await this.socialAuth.getUserInfo(
        command.provider,
        command.code,
      );

      // Check if user exists
      const existingUserOption = await this.userRepository.findByProviderId(
        socialUserInfo.provider,
        socialUserInfo.providerId,
      );

      let user: User;
      let isNewUser = false;

      if (Option.isSome(existingUserOption)) {
        user = existingUserOption.value;
      } else {
        // Create new user
        isNewUser = true;
        const username = this.generateUsername(socialUserInfo.email);
        user = User.create({
          email: socialUserInfo.email,
          username,
          provider: socialUserInfo.provider,
          providerId: socialUserInfo.providerId,
          profile: {
            displayName: socialUserInfo.name ?? undefined,
            avatarUrl: socialUserInfo.avatarUrl ?? undefined,
          },
        });
        user = await this.userRepository.save(user);
      }

      // Generate tokens
      const tokens = await this.tokenProvider.generateTokens({
        userId: user.id.value,
        email: user.email.value,
        role: user.role,
      });

      return Result.ok({ user, tokens, isNewUser });
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private generateUsername(email: string): string {
    const base = email.split('@')[0] ?? 'user';
    const random = Math.random().toString(36).substring(2, 8);
    return `${base}_${random}`;
  }
}