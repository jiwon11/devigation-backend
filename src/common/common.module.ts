import { Module, Global } from '@nestjs/common';
import { BusinessExceptionFilter } from './filters/business-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

@Global()
@Module({
  providers: [
    BusinessExceptionFilter,
    HttpExceptionFilter,
    LoggingInterceptor,
    TransformInterceptor,
  ],
  exports: [
    BusinessExceptionFilter,
    HttpExceptionFilter,
    LoggingInterceptor,
    TransformInterceptor,
  ],
})
export class CommonModule {}