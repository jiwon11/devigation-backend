import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Notification } from '@domain/interaction/notification';
import { UserId } from '@domain/user/user-id';
import { NotificationType } from '@domain/interaction/interaction.enum';
import { NOTIFICATION_REPOSITORY, NotificationRepositoryPort } from '../port/out/notification-repository.port';

export class SendNotificationCommand {
  constructor(
    public readonly recipientId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly message: string,
    public readonly actorId?: string,
    public readonly targetType?: string,
    public readonly targetId?: string,
  ) {}
}

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async execute(command: SendNotificationCommand): Promise<Result<Notification, Error>> {
    try {
      const notification = Notification.create({
        recipientId: UserId.create(command.recipientId),
        actorId: command.actorId !== undefined ? UserId.create(command.actorId) : undefined,
        type: command.type,
        title: command.title,
        message: command.message,
        targetType: command.targetType,
        targetId: command.targetId,
      });

      const savedNotification = await this.notificationRepository.save(notification);
      return Result.ok(savedNotification);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}