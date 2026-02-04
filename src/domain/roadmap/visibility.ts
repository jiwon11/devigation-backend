import { ValueObject } from '@domain/shared/value-object';

export enum VisibilityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED',
}

interface VisibilityProps {
  type: VisibilityType;
}

export class Visibility extends ValueObject<VisibilityProps> {
  private constructor(props: VisibilityProps) {
    super(props);
  }

  get type(): VisibilityType {
    return this.props.type;
  }

  static create(type: VisibilityType): Visibility {
    return new Visibility({ type });
  }

  static public(): Visibility {
    return new Visibility({ type: VisibilityType.PUBLIC });
  }

  static private(): Visibility {
    return new Visibility({ type: VisibilityType.PRIVATE });
  }

  static unlisted(): Visibility {
    return new Visibility({ type: VisibilityType.UNLISTED });
  }

  isPublic(): boolean {
    return this.props.type === VisibilityType.PUBLIC;
  }

  isPrivate(): boolean {
    return this.props.type === VisibilityType.PRIVATE;
  }

  isUnlisted(): boolean {
    return this.props.type === VisibilityType.UNLISTED;
  }

  protected validate(): void {
    const validTypes = Object.values(VisibilityType);
    if (!validTypes.includes(this.props.type)) {
      throw new Error('Invalid visibility type');
    }
  }
}