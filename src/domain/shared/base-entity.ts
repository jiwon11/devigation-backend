import { Identifier } from './identifier';

/**
 * Entity - 식별자로 구분되는 도메인 객체 베이스 클래스
 * 동등성은 ID로 판단
 */
export abstract class Entity<T, ID extends Identifier> {
  protected readonly _id: ID;
  protected props: T;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  protected constructor(id: ID, props: T, createdAt?: Date) {
    this._id = id;
    this.props = props;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = this._createdAt;
  }

  get id(): ID {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected markUpdated(): void {
    this._updatedAt = new Date();
  }

  /**
   * 동등성 비교 - ID로 판단
   */
  equals(entity?: Entity<T, ID>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (this === entity) {
      return true;
    }
    if (entity.constructor.name !== this.constructor.name) {
      return false;
    }
    return this._id.equals(entity._id);
  }
}