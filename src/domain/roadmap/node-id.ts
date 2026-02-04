import { Identifier } from '@domain/shared/identifier';
import { v4 as uuidv4 } from 'uuid';

export class NodeId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): NodeId {
    return new NodeId(value);
  }

  static generate(): NodeId {
    return new NodeId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('NodeId cannot be empty');
    }
  }
}