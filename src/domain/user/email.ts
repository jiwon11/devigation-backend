import { ValueObject } from '@domain/shared/value-object';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(email: string): Email {
    return new Email({ value: email.toLowerCase().trim() });
  }

  protected validate(): void {
    if (!Email.EMAIL_REGEX.test(this.props.value)) {
      throw new Error('Invalid email format');
    }
  }
}