import { Entity } from './base-entity';
import { Identifier } from './identifier';
import { DomainEvent } from './domain-event';

/**
 * AggregateRoot - 애그리게이트 루트 베이스 클래스
 * 도메인 이벤트 관리
 */
export abstract class AggregateRoot<T, ID extends Identifier> extends Entity<T, ID> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): readonly DomainEvent[] {
    return Object.freeze([...this._domainEvents]);
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  protected removeDomainEvent(event: DomainEvent): void {
    const index = this._domainEvents.findIndex((e) => e.equals(event));
    if (index !== -1) {
      this._domainEvents.splice(index, 1);
    }
  }
}