import { v4 as uuidv4 } from 'uuid';

/**
 * DomainEvent - 도메인 이벤트 베이스 클래스
 */
export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly aggregateId: string;

  protected constructor(aggregateId: string) {
    this.eventId = uuidv4();
    this.occurredAt = new Date();
    this.aggregateId = aggregateId;
  }

  abstract get eventName(): string;

  equals(event: DomainEvent): boolean {
    return this.eventId === event.eventId;
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      aggregateId: this.aggregateId,
    };
  }
}