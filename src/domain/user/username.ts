import { ValueObject } from '@domain/shared/value-object';

interface UsernameProps {
  value: string;
}

export class Username extends ValueObject<UsernameProps> {
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 30;

  private constructor(props: UsernameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(username: string): Username {
    return new Username({ value: username.trim() });
  }

  protected validate(): void {
    const { value } = this.props;

    if (value.length < Username.MIN_LENGTH || value.length > Username.MAX_LENGTH) {
      throw new Error(
        `Username must be between ${Username.MIN_LENGTH} and ${Username.MAX_LENGTH} characters`,
      );
    }

    if (!Username.USERNAME_REGEX.test(value)) {
      throw new Error(
        'Username can only contain letters, numbers, underscores, and hyphens',
      );
    }
  }
}