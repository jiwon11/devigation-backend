import { Identifier } from '@domain/shared/identifier';
import { v4 as uuidv4 } from 'uuid';

export class RoadmapId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): RoadmapId {
    return new RoadmapId(value);
  }

  static generate(): RoadmapId {
    return new RoadmapId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('RoadmapId cannot be empty');
    }
  }
}