import { Option } from '@common/types/option.type';
import { Paginated, PaginationParams } from '@common/types/pagination.type';
import { Notification, NotificationId } from '@domain/interaction/notification';
import { UserId } from '@domain/user/user-id';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface NotificationRepositoryPort {
  save(notification: Notification): Promise<Notification>;
  findById(id: NotificationId): Promise<Option<Notification>>;
  findByRecipient(recipientId: UserId, params: PaginationParams): Promise<Paginated<Notification>>;
  findUnreadByRecipient(recipientId: UserId, params: PaginationParams): Promise<Paginated<Notification>>;
  markAsRead(id: NotificationId): Promise<void>;
  markAllAsRead(recipientId: UserId): Promise<void>;
  countUnread(recipientId: UserId): Promise<number>;
  delete(id: NotificationId): Promise<void>;
}