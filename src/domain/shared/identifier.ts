import { ValueObject } from './value-object';

interface IdentifierProps {
  value: string;
}

/**
 * Identifier - 엔티티 식별자 베이스 클래스
 */
export abstract class Identifier extends ValueObject<IdentifierProps> {
  get value(): string {
    return this.props.value;
  }

  toString(): string {
    return this.props.value;
  }

  toValue(): string {
    return this.props.value;
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('Identifier cannot be empty');
    }
  }
}