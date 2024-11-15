import { GroupRepository } from '@group/repositories/group.repository';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MiddlewareEnum, ParamEnum } from '@shared/constants';
import { middlewaresExclude, ParamsExclude } from '@shared/utils/commons';
import {
  checkCustomInspectionFormNotFound,
  checkGroupNotFound,
  checkInspectionNotFound,
  checkMachineNotFound,
  checkMachineReportNotFound,
  checkUserGroupAssignmentNotFound,
} from '@shared/utils/errors';
import { I18nService } from 'nestjs-i18n';

import { AppLogger } from '../logger/logger.service';

@Injectable()
export class PathParamsCheckInterceptor implements NestInterceptor {
  constructor(
    private appLogger: AppLogger,
    private groupRepository: GroupRepository,
    private reflector: Reflector,
    private readonly i18n: I18nService,
  ) {
    this.appLogger.setContext(PathParamsCheckInterceptor.name);
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const exceptionInterceptor = middlewaresExclude(
      this.reflector,
      context,
      MiddlewareEnum.PATH_PARAMS_CHECK_INTERCEPTOR,
    );
    if (exceptionInterceptor) return next.handle();

    const request = context.switchToHttp().getRequest();
    const isoLocaleCode = request.headers['x-lang'];

    const {
      groupId,
      userId,
      machineId,
      inspectionId,
      machineReportId,
      customInspectionFormId,
    } = request.params;

    // Check if group not found
    if (groupId) {
      const group = await this.groupRepository.getGroupRelationships(
        groupId,
        userId,
        machineId,
        inspectionId,
        machineReportId,
        customInspectionFormId,
      );

      checkGroupNotFound(group, isoLocaleCode, this.i18n);

      // Check if user group assignment notfound
      if (userId) {
        checkUserGroupAssignmentNotFound(
          group.userGroupAssignments[0],
          isoLocaleCode,
          this.i18n,
        );
      }

      // Check if machine not found
      if (machineId) {
        checkMachineNotFound(group.machines[0], isoLocaleCode, this.i18n);

        // Check if inspection not found
        if (inspectionId) {
          checkInspectionNotFound(group.machines[0].inspections[0]);
        }

        // Check if machine report not found
        if (machineReportId) {
          checkMachineReportNotFound(group.machines[0].machineReports[0]);
        }

        // Check if custom inspection form not found
        if (
          customInspectionFormId &&
          !ParamsExclude(
            this.reflector,
            context,
            ParamEnum.CUSTOM_INSPECTION_FORM_ID,
          )
        ) {
          checkCustomInspectionFormNotFound(
            group.machines[0].customInspectionForms[0],
            isoLocaleCode,
            this.i18n,
          );
        }
      }

      request.group = group;
    }

    return next.handle();
  }
}
