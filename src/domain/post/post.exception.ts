import { BusinessException } from '@common/error/business-exception';
import { ErrorCode } from '@common/error/error-code.enum';

export class PostNotFoundException extends BusinessException {
  constructor(postId?: string) {
    super(ErrorCode.POST_NOT_FOUND, postId !== undefined ? { postId } : undefined);
  }
}

export class PostAccessDeniedException extends BusinessException {
  constructor(postId: string, userId: string) {
    super(ErrorCode.POST_ACCESS_DENIED, { postId, userId });
  }
}

export class PostAlreadyPublishedException extends BusinessException {
  constructor(postId: string) {
    super(ErrorCode.POST_ALREADY_PUBLISHED, { postId });
  }
}

export class PostNotPublishedException extends BusinessException {
  constructor(postId: string) {
    super(ErrorCode.POST_NOT_PUBLISHED, { postId });
  }
}

export class InvalidPostContentException extends BusinessException {
  constructor(reason?: string) {
    super(ErrorCode.INVALID_POST_CONTENT, reason !== undefined ? { reason } : undefined);
  }
}