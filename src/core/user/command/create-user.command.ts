import { AuthProvider } from '@domain/user/user.enum';

export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly username: string,
    public readonly provider: AuthProvider,
    public readonly providerId: string,
    public readonly displayName?: string,
    public readonly avatarUrl?: string,
  ) {}
}