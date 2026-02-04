import { AuthProvider } from '@domain/user/user.enum';

export class LoginCommand {
  constructor(
    public readonly provider: AuthProvider,
    public readonly code: string,
    public readonly redirectUrl: string,
  ) {}
}