import { BusinessException } from '@common/error/business-exception';
import { ErrorCode } from '@common/error/error-code.enum';

export class CommentNotFoundException extends BusinessException {
  constructor(commentId?: string) {
    super(ErrorCode.COMMENT_NOT_FOUND, commentId !== undefined ? { commentId } : undefined);
  }
}

export class CommentAccessDeniedException extends BusinessException {
  constructor(commentId: string, userId: string) {
    super(ErrorCode.COMMENT_ACCESS_DENIED, { commentId, userId });
  }
}

export class ParentCommentNotFoundException extends BusinessException {
  constructor(parentId: string) {
    super(ErrorCode.PARENT_COMMENT_NOT_FOUND, { parentId });
  }
}

export class MaxReplyDepthExceededException extends BusinessException {
  constructor(maxDepth: number) {
    super(ErrorCode.MAX_REPLY_DEPTH_EXCEEDED, { maxDepth });
  }
}