import { GroupRepository } from '@group/repositories';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ISOLocaleCode, StatusName } from '@shared/constants';
import { checkPermissionGroupSyncData } from '@shared/utils/commons';
import { checkInvalidSyncData, checkUserNotFound } from '@shared/utils/errors';
import { UserOutput } from '@user/dtos';
import {
  UserCiamLinkRepository,
  UserGroupAssignmentRepository,
  UserRepository,
} from '@user/repositories';
import { plainToInstance } from 'class-transformer';
import { isDateString } from 'class-validator';
import * as dayjs from 'dayjs';
import { I18nService } from 'nestjs-i18n';

import { AppLogger } from '../logger/logger.service';

@Injectable()
export class SyncValidateInterceptor implements NestInterceptor {
  constructor(
    private appLogger: AppLogger,
    private userGroupAssignmentRepository: UserGroupAssignmentRepository,
    private userRepository: UserRepository,
    private i18n: I18nService,
    private groupRepository: GroupRepository,
    private userCiamLinkRepository: UserCiamLinkRepository,
  ) {
    this.appLogger.setContext(SyncValidateInterceptor.name);
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const isoLocaleCode = request.headers['x-lang'] as ISOLocaleCode;
    const {
      claim: { oid, iss, emails },
      params: { groupId, machineId },
    } = request;
    const { lastStatusUpdatedAt } = request.body;

    // Check 401
    const user = await this.userRepository.getUserByCiam(oid, iss);
    checkUserNotFound(user, isoLocaleCode, this.i18n, HttpStatus.UNAUTHORIZED);

    // Check lastStatusUpdatedAt
    if (!isDateString(lastStatusUpdatedAt)) {
      throw new BadRequestException(
        'lastStatusUpdatedAt must be a Date instance',
      );
    }
    if (dayjs().isBefore(lastStatusUpdatedAt)) {
      throw new BadRequestException({
        message: 'The update time is greater than the current time.',
        statusName: StatusName.INVALID_DATA,
      });
    }

    // Check 404
    const { userId } = user;
    const group = await this.groupRepository.getGroupRelationships(
      groupId,
      undefined,
      machineId,
    );
    checkInvalidSyncData(
      group,
      isoLocaleCode,
      this.i18n,
      new Date(lastStatusUpdatedAt),
    );

    // Check permission
    await checkPermissionGroupSyncData(
      userId,
      groupId,
      this.userGroupAssignmentRepository,
      new Date(lastStatusUpdatedAt),
      isoLocaleCode,
      this.i18n,
    );
    request.user = plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    });
    request.group = group;

    if (emails?.length && emails[0] !== user.userCiamLinks[0].ciamEmail) {
      await this.userCiamLinkRepository.update(
        { oid, iss },
        { ciamEmail: emails[0] },
      );
    }

    return next.handle();
  }
}
