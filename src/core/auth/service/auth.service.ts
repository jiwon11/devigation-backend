import { Injectable, Inject } from '@nestjs/common';
import { TOKEN_PROVIDER, TokenProviderPort, TokenPayload } from '../port/out/token-provider.port';

@Injectable()
export class AuthService {
  constructor(
    @Inject(TOKEN_PROVIDER)
    private readonly tokenProvider: TokenProviderPort,
  ) {}

  async validateToken(token: string): Promise<TokenPayload | null> {
    return this.tokenProvider.verifyAccessToken(token);
  }
}