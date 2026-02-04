import { BusinessException } from '@common/error/business-exception';
import { ErrorCode } from '@common/error/error-code.enum';

export class UserNotFoundException extends BusinessException {
  constructor(userId?: string) {
    super(ErrorCode.USER_NOT_FOUND, userId !== undefined ? { userId } : undefined);
  }
}

export class UserAlreadyExistsException extends BusinessException {
  constructor(email?: string) {
    super(ErrorCode.USER_ALREADY_EXISTS, email !== undefined ? { email } : undefined);
  }
}

export class EmailAlreadyExistsException extends BusinessException {
  constructor(email: string) {
    super(ErrorCode.EMAIL_ALREADY_EXISTS, { email });
  }
}

export class UsernameAlreadyExistsException extends BusinessException {
  constructor(username: string) {
    super(ErrorCode.USERNAME_ALREADY_EXISTS, { username });
  }
}

export class InvalidUsernameException extends BusinessException {
  constructor(username: string) {
    super(ErrorCode.INVALID_USERNAME, { username });
  }
}

export class CannotFollowSelfException extends BusinessException {
  constructor() {
    super(ErrorCode.CANNOT_FOLLOW_SELF);
  }
}

export class AlreadyFollowingException extends BusinessException {
  constructor(followerId: string, followingId: string) {
    super(ErrorCode.ALREADY_FOLLOWING, { followerId, followingId });
  }
}

export class NotFollowingException extends BusinessException {
  constructor(followerId: string, followingId: string) {
    super(ErrorCode.NOT_FOLLOWING, { followerId, followingId });
  }
}