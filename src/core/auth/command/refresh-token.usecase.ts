import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { BusinessException } from '@common/error/business-exception';
import { ErrorCode } from '@common/error/error-code.enum';
import { UserId } from '@domain/user/user-id';
import { RefreshTokenCommand } from './refresh-token.command';
import { USER_REPOSITORY, UserRepositoryPort } from '@core/user/port/out/user-repository.port';
import { TOKEN_PROVIDER, TokenProviderPort, TokenPair } from '../port/out/token-provider.port';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(TOKEN_PROVIDER)
    private readonly tokenProvider: TokenProviderPort,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<Result<TokenPair, Error>> {
    try {
      // Verify refresh token
      const payload = await this.tokenProvider.verifyRefreshToken(command.refreshToken);
      if (payload === null) {
        return Result.fail(BusinessException.of(ErrorCode.REFRESH_TOKEN_EXPIRED));
      }

      // Check if user still exists
      const userOption = await this.userRepository.findById(UserId.create(payload.userId));
      if (!Option.isSome(userOption)) {
        return Result.fail(BusinessException.of(ErrorCode.USER_NOT_FOUND));
      }

      const user = userOption.value;

      // Revoke old refresh token
      await this.tokenProvider.revokeRefreshToken(command.refreshToken);

      // Generate new tokens
      const tokens = await this.tokenProvider.generateTokens({
        userId: user.id.value,
        email: user.email.value,
        role: user.role,
      });

      return Result.ok(tokens);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}