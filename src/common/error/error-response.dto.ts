import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from './error-code.enum';

export class ErrorResponseDto {
  @ApiProperty({ description: '에러 코드', example: 'USER_3000' })
  readonly code: ErrorCode;

  @ApiProperty({ description: '에러 메시지', example: '사용자를 찾을 수 없습니다.' })
  readonly message: string;

  @ApiProperty({ description: 'HTTP 상태 코드', example: 404 })
  readonly statusCode: number;

  @ApiProperty({ description: '타임스탬프', example: '2024-01-01T00:00:00.000Z' })
  readonly timestamp: string;

  @ApiProperty({ description: '요청 경로', example: '/api/v1/users/123' })
  readonly path: string;

  @ApiProperty({ description: '추가 상세 정보', required: false })
  readonly details?: Record<string, unknown>;

  constructor(params: {
    code: ErrorCode;
    message: string;
    statusCode: number;
    path: string;
    details?: Record<string, unknown>;
  }) {
    this.code = params.code;
    this.message = params.message;
    this.statusCode = params.statusCode;
    this.timestamp = new Date().toISOString();
    this.path = params.path;
    this.details = params.details;
  }
}