import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Paginated } from '@common/types/pagination.type';
import { Notification } from '@domain/interaction/notification';
import { UserId } from '@domain/user/user-id';
import { NOTIFICATION_REPOSITORY, NotificationRepositoryPort } from '../port/out/notification-repository.port';

export class GetNotificationsQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly unreadOnly: boolean = false,
  ) {}
}

@Injectable()
export class GetNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async execute(query: GetNotificationsQuery): Promise<Result<Paginated<Notification>, Error>> {
    try {
      const userId = UserId.create(query.userId);
      const params = { page: query.page, limit: query.limit };

      const notifications = query.unreadOnly
        ? await this.notificationRepository.findUnreadByRecipient(userId, params)
        : await this.notificationRepository.findByRecipient(userId, params);

      return Result.ok(notifications);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getUnreadCount(userId: string): Promise<Result<number, Error>> {
    try {
      const count = await this.notificationRepository.countUnread(UserId.create(userId));
      return Result.ok(count);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}