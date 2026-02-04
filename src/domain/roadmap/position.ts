import { ValueObject } from '@domain/shared/value-object';

interface PositionProps {
  x: number;
  y: number;
}

export class Position extends ValueObject<PositionProps> {
  private constructor(props: PositionProps) {
    super(props);
  }

  get x(): number {
    return this.props.x;
  }

  get y(): number {
    return this.props.y;
  }

  static create(x: number, y: number): Position {
    return new Position({ x, y });
  }

  static origin(): Position {
    return new Position({ x: 0, y: 0 });
  }

  move(deltaX: number, deltaY: number): Position {
    return new Position({
      x: this.props.x + deltaX,
      y: this.props.y + deltaY,
    });
  }

  protected validate(): void {
    // Position can be any number, no validation needed
  }
}