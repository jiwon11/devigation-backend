import { Identifier } from '@domain/shared/identifier';
import { v4 as uuidv4 } from 'uuid';

export class CommentId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): CommentId {
    return new CommentId(value);
  }

  static generate(): CommentId {
    return new CommentId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('CommentId cannot be empty');
    }
  }
}