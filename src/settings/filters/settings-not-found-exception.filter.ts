import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { SettingsNotFoundException } from '../exception/settings-not-found.exception';

@Catch(SettingsNotFoundException)
export class SettingsNotFoundExceptionFilter implements ExceptionFilter {
  public catch(
    exception: SettingsNotFoundException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
