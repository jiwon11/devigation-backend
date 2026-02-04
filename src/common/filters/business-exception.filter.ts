import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../error/business-exception';
import { ErrorResponseDto } from '../error/error-response.dto';

@Injectable()
@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BusinessExceptionFilter.name);

  catch(exception: BusinessException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.errorInfo.httpStatus;

    this.logger.warn(
      `BusinessException: ${exception.errorCode} - ${exception.message}`,
      exception.stack,
    );

    const errorResponse = new ErrorResponseDto({
      code: exception.errorCode,
      message: exception.message,
      statusCode: status,
      path: request.url,
      details: exception.details,
    });

    response.status(status).json(errorResponse);
  }
}