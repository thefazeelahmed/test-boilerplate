// global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '../dtos/api-response.dto';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const message = exception.message || 'Internal Server Error';

    const apiResponse = new ApiResponseDto(
      message,
      null,
      exception.message,
      false,
    );

    response.status(status).json(apiResponse);
  }
}
