import { BusinessException } from '@common/error/business-exception';
import { ErrorCode } from '@common/error/error-code.enum';

export class AlreadyLikedException extends BusinessException {
  constructor(targetType: string, targetId: string) {
    super(ErrorCode.ALREADY_LIKED, { targetType, targetId });
  }
}

export class NotLikedException extends BusinessException {
  constructor(targetType: string, targetId: string) {
    super(ErrorCode.NOT_LIKED, { targetType, targetId });
  }
}

export class AlreadyBookmarkedException extends BusinessException {
  constructor(targetType: string, targetId: string) {
    super(ErrorCode.ALREADY_BOOKMARKED, { targetType, targetId });
  }
}

export class NotBookmarkedException extends BusinessException {
  constructor(targetType: string, targetId: string) {
    super(ErrorCode.NOT_BOOKMARKED, { targetType, targetId });
  }
}

export class NotificationNotFoundException extends BusinessException {
  constructor(notificationId?: string) {
    super(
      ErrorCode.NOTIFICATION_NOT_FOUND,
      notificationId !== undefined ? { notificationId } : undefined,
    );
  }
}

export class BookmarkFolderNotFoundException extends BusinessException {
  constructor(folderId?: string) {
    super(
      ErrorCode.BOOKMARK_FOLDER_NOT_FOUND,
      folderId !== undefined ? { folderId } : undefined,
    );
  }
}