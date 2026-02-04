import { Identifier } from '@domain/shared/identifier';
import { v4 as uuidv4 } from 'uuid';

export class UserId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): UserId {
    return new UserId(value);
  }

  static generate(): UserId {
    return new UserId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('UserId cannot be empty');
    }
  }
}