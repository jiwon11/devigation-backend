import { ValueObject } from '@domain/shared/value-object';

interface ReadTimeProps {
  minutes: number;
}

export class ReadTime extends ValueObject<ReadTimeProps> {
  private static readonly WORDS_PER_MINUTE = 200;

  private constructor(props: ReadTimeProps) {
    super(props);
  }

  get minutes(): number {
    return this.props.minutes;
  }

  static fromWordCount(wordCount: number): ReadTime {
    const minutes = Math.max(1, Math.ceil(wordCount / ReadTime.WORDS_PER_MINUTE));
    return new ReadTime({ minutes });
  }

  static create(minutes: number): ReadTime {
    return new ReadTime({ minutes: Math.max(1, minutes) });
  }

  toString(): string {
    return `${this.props.minutes} min read`;
  }

  protected validate(): void {
    if (this.props.minutes < 1) {
      throw new Error('Read time must be at least 1 minute');
    }
  }
}