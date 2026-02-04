import { Entity } from '@domain/shared/base-entity';
import { Identifier } from '@domain/shared/identifier';
import { UserId } from '@domain/user/user-id';
import { NotificationType } from './interaction.enum';
import { v4 as uuidv4 } from 'uuid';

export class NotificationId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): NotificationId {
    return new NotificationId(value);
  }

  static generate(): NotificationId {
    return new NotificationId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('NotificationId cannot be empty');
    }
  }
}

interface NotificationProps {
  recipientId: UserId;
  actorId: UserId | null;
  type: NotificationType;
  title: string;
  message: string;
  targetType: string | null;
  targetId: string | null;
  isRead: boolean;
  readAt: Date | null;
}

export class Notification extends Entity<NotificationProps, NotificationId> {
  private constructor(id: NotificationId, props: NotificationProps, createdAt?: Date) {
    super(id, props, createdAt);
  }

  // Getters
  get recipientId(): UserId {
    return this.props.recipientId;
  }

  get actorId(): UserId | null {
    return this.props.actorId;
  }

  get type(): NotificationType {
    return this.props.type;
  }

  get title(): string {
    return this.props.title;
  }

  get message(): string {
    return this.props.message;
  }

  get targetType(): string | null {
    return this.props.targetType;
  }

  get targetId(): string | null {
    return this.props.targetId;
  }

  get isRead(): boolean {
    return this.props.isRead;
  }

  get readAt(): Date | null {
    return this.props.readAt;
  }

  // Factory methods
  static create(params: {
    recipientId: UserId;
    actorId?: UserId;
    type: NotificationType;
    title: string;
    message: string;
    targetType?: string;
    targetId?: string;
  }): Notification {
    return new Notification(NotificationId.generate(), {
      recipientId: params.recipientId,
      actorId: params.actorId ?? null,
      type: params.type,
      title: params.title,
      message: params.message,
      targetType: params.targetType ?? null,
      targetId: params.targetId ?? null,
      isRead: false,
      readAt: null,
    });
  }

  static reconstitute(
    id: NotificationId,
    props: NotificationProps,
    createdAt: Date,
  ): Notification {
    return new Notification(id, props, createdAt);
  }

  // Domain methods
  markAsRead(): void {
    if (!this.props.isRead) {
      this.props.isRead = true;
      this.props.readAt = new Date();
      this.markUpdated();
    }
  }

  markAsUnread(): void {
    if (this.props.isRead) {
      this.props.isRead = false;
      this.props.readAt = null;
      this.markUpdated();
    }
  }
}