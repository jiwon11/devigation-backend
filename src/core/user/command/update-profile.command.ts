export class UpdateProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly displayName?: string,
    public readonly bio?: string,
    public readonly avatarUrl?: string,
    public readonly githubUrl?: string,
    public readonly websiteUrl?: string,
    public readonly location?: string,
    public readonly company?: string,
  ) {}
}