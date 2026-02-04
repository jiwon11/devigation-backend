import { Entity } from '@domain/shared/base-entity';
import { Identifier } from '@domain/shared/identifier';
import { UserId } from './user-id';
import { AuthProvider } from './user.enum';
import { v4 as uuidv4 } from 'uuid';

export class SocialAccountId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): SocialAccountId {
    return new SocialAccountId(value);
  }

  static generate(): SocialAccountId {
    return new SocialAccountId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('SocialAccountId cannot be empty');
    }
  }
}

interface SocialAccountProps {
  userId: UserId;
  provider: AuthProvider;
  providerId: string;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
}

export class SocialAccount extends Entity<SocialAccountProps, SocialAccountId> {
  private constructor(id: SocialAccountId, props: SocialAccountProps, createdAt?: Date) {
    super(id, props, createdAt);
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get provider(): AuthProvider {
    return this.props.provider;
  }

  get providerId(): string {
    return this.props.providerId;
  }

  get accessToken(): string | null {
    return this.props.accessToken;
  }

  get refreshToken(): string | null {
    return this.props.refreshToken;
  }

  get tokenExpiresAt(): Date | null {
    return this.props.tokenExpiresAt;
  }

  static create(params: {
    userId: UserId;
    provider: AuthProvider;
    providerId: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
  }): SocialAccount {
    return new SocialAccount(SocialAccountId.generate(), {
      userId: params.userId,
      provider: params.provider,
      providerId: params.providerId,
      accessToken: params.accessToken ?? null,
      refreshToken: params.refreshToken ?? null,
      tokenExpiresAt: params.tokenExpiresAt ?? null,
    });
  }

  static reconstitute(
    id: SocialAccountId,
    props: SocialAccountProps,
    createdAt: Date,
  ): SocialAccount {
    return new SocialAccount(id, props, createdAt);
  }

  updateTokens(params: {
    accessToken: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
  }): void {
    this.props.accessToken = params.accessToken;
    if (params.refreshToken !== undefined) {
      this.props.refreshToken = params.refreshToken;
    }
    if (params.tokenExpiresAt !== undefined) {
      this.props.tokenExpiresAt = params.tokenExpiresAt;
    }
    this.markUpdated();
  }
}