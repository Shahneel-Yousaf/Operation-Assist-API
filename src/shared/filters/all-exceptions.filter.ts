import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

import {
  apiSyncPaths,
  ISOLocaleCode,
  LANGUAGE_HEADER,
  PLATFORM,
  REQUEST_ID_TOKEN_HEADER,
  StatusName,
} from '../constants';
import { AppLogger } from '../logger/logger.service';
import { createRequestContext } from '../request-context/util';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  /** set logger context */
  constructor(
    private readonly i18n: I18nService,
    private config: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: T, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest<Request>();
    const res: Response = ctx.getResponse<Response>();

    const path = req.url;
    const method = req.method;
    const timestamp = new Date().toISOString();
    const requestId = req.header(REQUEST_ID_TOKEN_HEADER);
    const requestContext = createRequestContext(req);
    const languageHeader =
      req.header(LANGUAGE_HEADER) ??
      requestContext?.user?.isoLocaleCode ??
      ISOLocaleCode.EN;
    const platform = req.header(PLATFORM);
    const errorName = exception.constructor?.name ?? 'InternalException';
    const message = exception['message'] ?? 'Internal server error';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let details: string | object;
    let customMessage: string;
    let errorType: string;
    let statusName: string;
    let errorStatusName: string;
    let isDeleted: boolean;
    let customValidateKey: string;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      // Specified response fields
      details = exception.getResponse();
      customMessage = details['customMessage'];
      errorType = details['errorType'];
      errorStatusName = details['statusName'];
      isDeleted = details['isDeleted'];
      customValidateKey = details['customValidateKey'];
    }

    const localizedMessage =
      customMessage ||
      this.getCustomValidateMessage(customValidateKey, languageHeader) ||
      this.getErrorMessage(statusCode, languageHeader);

    if (apiSyncPaths.some((item) => path.includes(item))) {
      switch (true) {
        case !!errorStatusName:
          statusName = errorStatusName;
          break;
        case statusCode === HttpStatus.FORBIDDEN:
          statusName = StatusName.PERMISSION_ERROR;
          break;
        case statusCode === HttpStatus.BAD_REQUEST ||
          statusCode === HttpStatus.NOT_FOUND:
          statusName = StatusName.INVALID_DATA;
          break;
        default:
          statusName = StatusName.SYNCED_FAILED;
      }
    }

    // NOTE: For reference, please check https://cloud.google.com/apis/design/errors
    const error = {
      statusCode,
      message,
      localizedMessage,
      errorName,
      errorType,

      // Additional meta added by us.
      path,
      method,
      details,
      requestId,
      timestamp,
      syncStatus: statusName,
      isDeleted,
      platform,
    };

    this.logger.error(requestContext, error.message, {
      error,
      stack: exception['stack'],
    });

    // Suppress original internal server error details in prod mode
    if (this.config.get<string>('env') === 'production') {
      if (error.message !== 'jwt expired') {
        error.message = 'Internal server error';
      }
      error.errorName = undefined;
      error.details = undefined;
    }

    res.status(statusCode).json({ error });
  }

  getErrorMessage(status: number, language: string) {
    let errorType = 'message.commonError';
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        errorType = 'message.authenticationError';
        break;
      case HttpStatus.FORBIDDEN:
        errorType = 'message.forbiddenError';
        break;
    }

    return this.i18n.t(errorType, {
      lang: language,
    });
  }

  getCustomValidateMessage(customValidateKey: string, language: string) {
    return this.i18n.t(customValidateKey ?? '', {
      lang: language,
    });
  }
}
