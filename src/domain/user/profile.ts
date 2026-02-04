import { ValueObject } from '@domain/shared/value-object';

interface ProfileProps {
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  location: string | null;
  company: string | null;
}

export class Profile extends ValueObject<ProfileProps> {
  private static readonly BIO_MAX_LENGTH = 500;
  private static readonly DISPLAY_NAME_MAX_LENGTH = 100;

  private constructor(props: ProfileProps) {
    super(props);
  }

  get displayName(): string | null {
    return this.props.displayName;
  }

  get bio(): string | null {
    return this.props.bio;
  }

  get avatarUrl(): string | null {
    return this.props.avatarUrl;
  }

  get githubUrl(): string | null {
    return this.props.githubUrl;
  }

  get websiteUrl(): string | null {
    return this.props.websiteUrl;
  }

  get location(): string | null {
    return this.props.location;
  }

  get company(): string | null {
    return this.props.company;
  }

  static create(props: Partial<ProfileProps>): Profile {
    return new Profile({
      displayName: props.displayName ?? null,
      bio: props.bio ?? null,
      avatarUrl: props.avatarUrl ?? null,
      githubUrl: props.githubUrl ?? null,
      websiteUrl: props.websiteUrl ?? null,
      location: props.location ?? null,
      company: props.company ?? null,
    });
  }

  static empty(): Profile {
    return Profile.create({});
  }

  update(props: Partial<ProfileProps>): Profile {
    return new Profile({
      ...this.props,
      ...props,
    });
  }

  protected validate(): void {
    const { displayName, bio } = this.props;

    if (displayName !== null && displayName.length > Profile.DISPLAY_NAME_MAX_LENGTH) {
      throw new Error(
        `Display name must not exceed ${Profile.DISPLAY_NAME_MAX_LENGTH} characters`,
      );
    }

    if (bio !== null && bio.length > Profile.BIO_MAX_LENGTH) {
      throw new Error(`Bio must not exceed ${Profile.BIO_MAX_LENGTH} characters`);
    }
  }
}