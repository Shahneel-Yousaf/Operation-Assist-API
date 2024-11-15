import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ISOLocaleCode,
  MiddlewareEnum,
  PERMISSION_METADATA,
} from '@shared/constants';
import {
  checkPermissionGroup,
  middlewaresExclude,
} from '@shared/utils/commons';
import { checkUserNotFound } from '@shared/utils/errors';
import { UserOutput } from '@user/dtos';
import { UserCiamLinkRepository } from '@user/repositories';
import { UserRepository } from '@user/repositories/user.repository';
import { UserGroupAssignmentRepository } from '@user/repositories/user-group-assignment.repository';
import { plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';

import { AppLogger } from '../logger/logger.service';

@Injectable()
export class PermissionInterceptor implements NestInterceptor {
  constructor(
    private appLogger: AppLogger,
    private userRepository: UserRepository,
    private userGroupAssignmentRepository: UserGroupAssignmentRepository,
    private reflector: Reflector,
    private i18n: I18nService,
    private userCiamLinkRepository: UserCiamLinkRepository,
  ) {
    this.appLogger.setContext(PermissionInterceptor.name);
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const permissionInterceptor = middlewaresExclude(
      this.reflector,
      context,
      MiddlewareEnum.PERMISSION_INTERCEPTOR,
    );
    if (permissionInterceptor) return next.handle();

    const request = context.switchToHttp().getRequest();
    const { oid, iss, emails } = request.claim;
    const groupId = request?.params?.groupId;
    const isoLocaleCode = request.headers['x-lang'];

    const user = await this.userRepository.getUserByCiam(oid, iss);
    checkUserNotFound(user, isoLocaleCode, this.i18n, HttpStatus.UNAUTHORIZED);

    // Check permissions
    if (groupId) {
      const permission = this.reflector.get(
        PERMISSION_METADATA,
        context.getHandler(),
      );

      const screenPermission = await checkPermissionGroup(
        permission,
        user.userId,
        groupId,
        this.userGroupAssignmentRepository,
      );

      // Add list permission into request
      request.permission = screenPermission;
    }

    if (emails?.length && emails[0] !== user.userCiamLinks[0].ciamEmail) {
      await this.userCiamLinkRepository.update(
        { oid, iss },
        { ciamEmail: emails[0] },
      );
    }

    request.user = plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    });
    request.isoLocaleCode =
      isoLocaleCode ?? user.isoLocaleCode ?? ISOLocaleCode.EN;

    return next.handle();
  }
}
