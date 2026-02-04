import { Module } from '@nestjs/common';
import { ToggleLikeUseCase } from './command/toggle-like.usecase';
import { ToggleBookmarkUseCase } from './command/toggle-bookmark.usecase';
import { SendNotificationUseCase } from './command/send-notification.usecase';
import { GetNotificationsUseCase } from './query/get-notifications.usecase';
import { NotificationService } from './service/notification.service';

@Module({
  providers: [
    ToggleLikeUseCase,
    ToggleBookmarkUseCase,
    SendNotificationUseCase,
    GetNotificationsUseCase,
    NotificationService,
  ],
  exports: [
    ToggleLikeUseCase,
    ToggleBookmarkUseCase,
    SendNotificationUseCase,
    GetNotificationsUseCase,
    NotificationService,
  ],
})
export class InteractionModule {}