import { Injectable } from '@nestjs/common';
import { Option } from '@common/types/option.type';
import { Paginated, Pagination, PaginationParams } from '@common/types/pagination.type';
import { Notification, NotificationId } from '@domain/interaction/notification';
import { UserId } from '@domain/user/user-id';
import { NotificationRepositoryPort } from '@core/interaction/port/out/notification-repository.port';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';

@Injectable()
export class SupabaseNotificationRepository implements NotificationRepositoryPort {
  constructor(private readonly supabase: SupabaseService) {}

  async save(notification: Notification): Promise<Notification> {
    return notification;
  }

  async findById(id: NotificationId): Promise<Option<Notification>> {
    return Option.none();
  }

  async findByRecipient(
    recipientId: UserId,
    params: PaginationParams,
  ): Promise<Paginated<Notification>> {
    return Pagination.create([], params, 0);
  }

  async findUnreadByRecipient(
    recipientId: UserId,
    params: PaginationParams,
  ): Promise<Paginated<Notification>> {
    return Pagination.create([], params, 0);
  }

  async markAsRead(id: NotificationId): Promise<void> {}

  async markAllAsRead(recipientId: UserId): Promise<void> {}

  async countUnread(recipientId: UserId): Promise<number> {
    return 0;
  }

  async delete(id: NotificationId): Promise<void> {}
}