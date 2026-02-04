/**
 * ValueObject - 불변 값 객체 베이스 클래스
 * 동등성은 값으로 판단
 */
export abstract class ValueObject<T extends object> {
  protected readonly props: Readonly<T>;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
    this.validate();
  }

  /**
   * 값 객체 유효성 검사 - 하위 클래스에서 구현
   */
  protected abstract validate(): void;

  /**
   * 동등성 비교
   */
  equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.constructor.name !== this.constructor.name) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }

  /**
   * 원시 값 반환
   */
  toValue(): T {
    return { ...this.props };
  }
}