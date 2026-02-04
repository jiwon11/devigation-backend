import { ValueObject } from '@domain/shared/value-object';

interface NodeStyleProps {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  borderWidth: number;
  borderRadius: number;
  width: number;
  height: number;
}

export class NodeStyle extends ValueObject<NodeStyleProps> {
  private constructor(props: NodeStyleProps) {
    super(props);
  }

  get backgroundColor(): string {
    return this.props.backgroundColor;
  }

  get borderColor(): string {
    return this.props.borderColor;
  }

  get textColor(): string {
    return this.props.textColor;
  }

  get borderWidth(): number {
    return this.props.borderWidth;
  }

  get borderRadius(): number {
    return this.props.borderRadius;
  }

  get width(): number {
    return this.props.width;
  }

  get height(): number {
    return this.props.height;
  }

  static create(props: Partial<NodeStyleProps>): NodeStyle {
    return new NodeStyle({
      backgroundColor: props.backgroundColor ?? '#ffffff',
      borderColor: props.borderColor ?? '#e2e8f0',
      textColor: props.textColor ?? '#1a202c',
      borderWidth: props.borderWidth ?? 1,
      borderRadius: props.borderRadius ?? 8,
      width: props.width ?? 200,
      height: props.height ?? 80,
    });
  }

  static default(): NodeStyle {
    return NodeStyle.create({});
  }

  update(props: Partial<NodeStyleProps>): NodeStyle {
    return new NodeStyle({
      ...this.props,
      ...props,
    });
  }

  protected validate(): void {
    if (this.props.borderWidth < 0) {
      throw new Error('Border width cannot be negative');
    }
    if (this.props.borderRadius < 0) {
      throw new Error('Border radius cannot be negative');
    }
    if (this.props.width <= 0 || this.props.height <= 0) {
      throw new Error('Width and height must be positive');
    }
  }
}