import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from './logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: Record<string, unknown>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let code = 'E_INTERNAL_SERVER_ERROR';

    const { statusCode, message, error }: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            message: exception.message,
            error: exception.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };

    if (statusCode === 500 || Array.isArray(message)) {
      this.loggerService.error(JSON.stringify(message), error);
    }

    if (statusCode === 400) {
      code = 'E_INVALID_DATA';
    } else if (statusCode === 401) {
      code = 'E_UNAUTHORIZED';
    } else if (statusCode === 404) {
      code = 'E_NOT_FOUND';
    }

    response.status(statusCode).json({
      statusCode,
      code,
      message:
        statusCode === 500
          ? 'Internal Server Error'
          : typeof message === 'string' && statusCode !== 404
          ? message
          : error,
      data: null,
      errors:
        statusCode === 404
          ? [error]
          : typeof message === 'string'
          ? [message]
          : message,
    });
  }
}
