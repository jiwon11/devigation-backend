import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code.enum';

export interface ErrorCodeInfo {
  readonly code: ErrorCode;
  readonly message: string;
  readonly httpStatus: HttpStatus;
}

export const ERROR_CODE_MAP: Record<ErrorCode, ErrorCodeInfo> = {
  // Common Errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: '서버 내부 오류가 발생했습니다.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorCode.INVALID_INPUT]: {
    code: ErrorCode.INVALID_INPUT,
    message: '잘못된 입력입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.UNAUTHORIZED]: {
    code: ErrorCode.UNAUTHORIZED,
    message: '인증이 필요합니다.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.FORBIDDEN]: {
    code: ErrorCode.FORBIDDEN,
    message: '접근 권한이 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.NOT_FOUND]: {
    code: ErrorCode.NOT_FOUND,
    message: '리소스를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.CONFLICT]: {
    code: ErrorCode.CONFLICT,
    message: '리소스 충돌이 발생했습니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.VALIDATION_FAILED]: {
    code: ErrorCode.VALIDATION_FAILED,
    message: '유효성 검사에 실패했습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // Auth Errors
  [ErrorCode.INVALID_CREDENTIALS]: {
    code: ErrorCode.INVALID_CREDENTIALS,
    message: '인증 정보가 올바르지 않습니다.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.TOKEN_EXPIRED]: {
    code: ErrorCode.TOKEN_EXPIRED,
    message: '토큰이 만료되었습니다.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.TOKEN_INVALID]: {
    code: ErrorCode.TOKEN_INVALID,
    message: '유효하지 않은 토큰입니다.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.REFRESH_TOKEN_EXPIRED]: {
    code: ErrorCode.REFRESH_TOKEN_EXPIRED,
    message: '리프레시 토큰이 만료되었습니다.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.OAUTH_FAILED]: {
    code: ErrorCode.OAUTH_FAILED,
    message: 'OAuth 인증에 실패했습니다.',
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.ALREADY_LOGGED_IN]: {
    code: ErrorCode.ALREADY_LOGGED_IN,
    message: '이미 로그인된 상태입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },

  // User Errors
  [ErrorCode.USER_NOT_FOUND]: {
    code: ErrorCode.USER_NOT_FOUND,
    message: '사용자를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.USER_ALREADY_EXISTS]: {
    code: ErrorCode.USER_ALREADY_EXISTS,
    message: '이미 존재하는 사용자입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.EMAIL_ALREADY_EXISTS]: {
    code: ErrorCode.EMAIL_ALREADY_EXISTS,
    message: '이미 사용 중인 이메일입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.USERNAME_ALREADY_EXISTS]: {
    code: ErrorCode.USERNAME_ALREADY_EXISTS,
    message: '이미 사용 중인 사용자명입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.INVALID_USERNAME]: {
    code: ErrorCode.INVALID_USERNAME,
    message: '유효하지 않은 사용자명입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CANNOT_FOLLOW_SELF]: {
    code: ErrorCode.CANNOT_FOLLOW_SELF,
    message: '자기 자신을 팔로우할 수 없습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.ALREADY_FOLLOWING]: {
    code: ErrorCode.ALREADY_FOLLOWING,
    message: '이미 팔로우 중입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.NOT_FOLLOWING]: {
    code: ErrorCode.NOT_FOLLOWING,
    message: '팔로우 상태가 아닙니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // Roadmap Errors
  [ErrorCode.ROADMAP_NOT_FOUND]: {
    code: ErrorCode.ROADMAP_NOT_FOUND,
    message: '로드맵을 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.ROADMAP_ACCESS_DENIED]: {
    code: ErrorCode.ROADMAP_ACCESS_DENIED,
    message: '로드맵에 접근할 수 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.ROADMAP_ALREADY_FORKED]: {
    code: ErrorCode.ROADMAP_ALREADY_FORKED,
    message: '이미 포크한 로드맵입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.NODE_NOT_FOUND]: {
    code: ErrorCode.NODE_NOT_FOUND,
    message: '노드를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.EDGE_NOT_FOUND]: {
    code: ErrorCode.EDGE_NOT_FOUND,
    message: '엣지를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.INVALID_NODE_CONNECTION]: {
    code: ErrorCode.INVALID_NODE_CONNECTION,
    message: '유효하지 않은 노드 연결입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.MAX_NODES_EXCEEDED]: {
    code: ErrorCode.MAX_NODES_EXCEEDED,
    message: '최대 노드 수를 초과했습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // Post Errors
  [ErrorCode.POST_NOT_FOUND]: {
    code: ErrorCode.POST_NOT_FOUND,
    message: '포스트를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.POST_ACCESS_DENIED]: {
    code: ErrorCode.POST_ACCESS_DENIED,
    message: '포스트에 접근할 수 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.POST_ALREADY_PUBLISHED]: {
    code: ErrorCode.POST_ALREADY_PUBLISHED,
    message: '이미 발행된 포스트입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.POST_NOT_PUBLISHED]: {
    code: ErrorCode.POST_NOT_PUBLISHED,
    message: '발행되지 않은 포스트입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_POST_CONTENT]: {
    code: ErrorCode.INVALID_POST_CONTENT,
    message: '유효하지 않은 포스트 내용입니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // Comment Errors
  [ErrorCode.COMMENT_NOT_FOUND]: {
    code: ErrorCode.COMMENT_NOT_FOUND,
    message: '댓글을 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.COMMENT_ACCESS_DENIED]: {
    code: ErrorCode.COMMENT_ACCESS_DENIED,
    message: '댓글에 접근할 수 없습니다.',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.PARENT_COMMENT_NOT_FOUND]: {
    code: ErrorCode.PARENT_COMMENT_NOT_FOUND,
    message: '상위 댓글을 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.MAX_REPLY_DEPTH_EXCEEDED]: {
    code: ErrorCode.MAX_REPLY_DEPTH_EXCEEDED,
    message: '최대 답글 깊이를 초과했습니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // Interaction Errors
  [ErrorCode.ALREADY_LIKED]: {
    code: ErrorCode.ALREADY_LIKED,
    message: '이미 좋아요한 항목입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.NOT_LIKED]: {
    code: ErrorCode.NOT_LIKED,
    message: '좋아요 상태가 아닙니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.ALREADY_BOOKMARKED]: {
    code: ErrorCode.ALREADY_BOOKMARKED,
    message: '이미 북마크한 항목입니다.',
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.NOT_BOOKMARKED]: {
    code: ErrorCode.NOT_BOOKMARKED,
    message: '북마크 상태가 아닙니다.',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.NOTIFICATION_NOT_FOUND]: {
    code: ErrorCode.NOTIFICATION_NOT_FOUND,
    message: '알림을 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.BOOKMARK_FOLDER_NOT_FOUND]: {
    code: ErrorCode.BOOKMARK_FOLDER_NOT_FOUND,
    message: '북마크 폴더를 찾을 수 없습니다.',
    httpStatus: HttpStatus.NOT_FOUND,
  },
};