import { Injectable, Inject } from '@nestjs/common';
import { UserId } from '@domain/user/user-id';
import { NotificationId } from '@domain/interaction/notification';
import { NOTIFICATION_REPOSITORY, NotificationRepositoryPort } from '../port/out/notification-repository.port';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async markAsRead(notificationId: string): Promise<void> {
    await this.notificationRepository.markAsRead(NotificationId.create(notificationId));
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(UserId.create(userId));
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.countUnread(UserId.create(userId));
  }
}