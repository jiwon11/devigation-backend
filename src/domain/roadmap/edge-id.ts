import { Identifier } from '@domain/shared/identifier';
import { v4 as uuidv4 } from 'uuid';

export class EdgeId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): EdgeId {
    return new EdgeId(value);
  }

  static generate(): EdgeId {
    return new EdgeId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('EdgeId cannot be empty');
    }
  }
}