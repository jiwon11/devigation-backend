import { Identifier } from '@domain/shared/identifier';
import { v4 as uuidv4 } from 'uuid';

export class PostId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): PostId {
    return new PostId(value);
  }

  static generate(): PostId {
    return new PostId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('PostId cannot be empty');
    }
  }
}