import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { EpisodeDuplicatedException } from '../exceptions/episode-duplicated.exception';

@Catch(EpisodeDuplicatedException)
export class EpisodeDuplicatedFilter implements ExceptionFilter {
  public catch(
    exception: EpisodeDuplicatedException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
