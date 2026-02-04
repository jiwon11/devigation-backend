export const TOKEN_PROVIDER = Symbol('TOKEN_PROVIDER');

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenProviderPort {
  generateTokens(payload: TokenPayload): Promise<TokenPair>;
  verifyAccessToken(token: string): Promise<TokenPayload | null>;
  verifyRefreshToken(token: string): Promise<TokenPayload | null>;
  revokeRefreshToken(token: string): Promise<void>;
}