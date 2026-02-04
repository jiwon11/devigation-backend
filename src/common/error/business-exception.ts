import { ErrorCode } from './error-code.enum';
import { ERROR_CODE_MAP, ErrorCodeInfo } from './error-code';

export class BusinessException extends Error {
  readonly errorCode: ErrorCode;
  readonly errorInfo: ErrorCodeInfo;
  readonly details?: Record<string, unknown>;

  constructor(errorCode: ErrorCode, details?: Record<string, unknown>) {
    const errorInfo = ERROR_CODE_MAP[errorCode];
    super(errorInfo.message);
    this.name = 'BusinessException';
    this.errorCode = errorCode;
    this.errorInfo = errorInfo;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static of(errorCode: ErrorCode, details?: Record<string, unknown>): BusinessException {
    return new BusinessException(errorCode, details);
  }
}