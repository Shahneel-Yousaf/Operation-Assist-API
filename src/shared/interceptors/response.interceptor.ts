import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MiddlewareEnum } from '@shared/constants';
import { middlewaresExclude } from '@shared/utils/commons';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppLogger } from '../logger/logger.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private appLogger: AppLogger, private reflector: Reflector) {
    this.appLogger.setContext(ResponseInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const permissionInterceptor = middlewaresExclude(
      this.reflector,
      context,
      MiddlewareEnum.RESPONSE_INTERCEPTOR,
    );
    if (permissionInterceptor) return next.handle();

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        data.meta.screenPermission = request.permission;
        return data;
      }),
    );
  }
}
