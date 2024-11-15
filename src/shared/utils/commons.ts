import { UserFcmTokenPushNotification } from '@firebase/dtos';
import { GetMachineSummaryOrderBy } from '@machine-report/dtos';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ALPHABET_REGEX,
  ErrorType,
  INTEGER_REGEX,
  MachineSummarySortByField,
  MIDDLEWARE_EXCEPTION,
  MiddlewareEnum,
  Operation,
  Order,
  PARAM_EXCEPTION,
  ParamEnum,
  Resource,
  SEARCH_ID_LENGTH,
  StatusName,
  UserGroupAssignmentCurrentStatus,
} from '@shared/constants';
import { ScreenPermissionResponse } from '@shared/dtos';
import { User } from '@user/entities';
import { UserGroupAssignmentRepository } from '@user/repositories';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import { I18nService } from 'nestjs-i18n';

export function middlewaresExclude(
  reflector: Reflector,
  context: ExecutionContext,
  guardName: MiddlewareEnum,
) {
  const middlewaresException =
    reflector.get<MiddlewareEnum[]>(
      MIDDLEWARE_EXCEPTION,
      context.getHandler(),
    ) ?? [];

  return middlewaresException.includes(guardName);
}

export function generateRandomSearchId() {
  return crypto
    .randomInt(0, 1000000000)
    .toString()
    .padStart(SEARCH_ID_LENGTH, '0');
}

export async function checkPermissionGroup(
  permission: string,
  userId: string,
  groupId: string,
  userGroupAssignmentRepository: UserGroupAssignmentRepository,
) {
  const [resourceCode, operationCode] = permission?.split('.') ?? [];
  const checkPermission =
    await userGroupAssignmentRepository.checkPermissionInGroup(userId, groupId);

  const permissionCodes =
    checkPermission?.userGroupPermissionAssignments.reduce(
      (acc, { permission: { resource, operation } }) => {
        acc[resource.resourceCode] = operation.operationCode;
        return acc;
      },
      {},
    );

  // Check the user's permission in group
  if (
    !checkPermission ||
    (resourceCode && !permissionCodes[resourceCode]?.includes(operationCode))
  ) {
    throw new ForbiddenException('User have not permissions in this group.');
  }

  // return list permission for permission interceptor
  return {
    allowEditDeleteGroup:
      permissionCodes[Resource.GROUPS] === Operation.UPDATE_DELETE,
    allowCreateEditDeleteMachine:
      permissionCodes[Resource.MACHINES] ===
      Operation.READ_CREATE_UPDATE_DELETE,
    allowCreateEditDeleteMember:
      permissionCodes[Resource.USER_GROUP_ASSIGNMENTS] ===
      Operation.READ_CREATE_UPDATE_DELETE,
    allowCreateEditDeleteInspectionForm:
      permissionCodes[Resource.CUSTOM_INSPECTION_FORMS] ===
      Operation.READ_CREATE_UPDATE,
    allowCreateInspectionAndReport:
      permissionCodes[Resource.INSPECTIONS_AND_MACHINE_REPORTS] ===
      Operation.READ_CREATE,
  } as ScreenPermissionResponse;
}

export const toSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const keysToSnakeCase = (
  obj: Record<string, any>,
): Record<string, any> => {
  const snakeCaseObj: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      snakeCaseObj[toSnakeCase(key)] = obj[key];
    }
  }
  return snakeCaseObj;
};
export async function streamToBuffer(readableStream: NodeJS.ReadableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}

export function ParamsExclude(
  reflector: Reflector,
  context: ExecutionContext,
  param: ParamEnum,
) {
  const paramsException =
    reflector.get<ParamEnum[]>(PARAM_EXCEPTION, context.getHandler()) ?? [];

  return paramsException.includes(param);
}

export function groupDeviceUsersByLocaleCode(
  userDevices: User[],
): Record<string, UserFcmTokenPushNotification[]> {
  return userDevices.reduce((acc, curr) => {
    const isoLocaleCode = curr.isoLocaleCode;

    if (!acc[isoLocaleCode]) {
      acc[isoLocaleCode] = [];
    }

    acc[isoLocaleCode].push({
      userId: curr.userId,
      fcmToken: curr.devices[0].fcmToken,
    });

    return acc;
  }, {});
}

export async function checkPermissionGroupSyncData(
  userId: string,
  groupId: string,
  userGroupAssignmentRepository: UserGroupAssignmentRepository,
  lastStatusUpdatedAt: Date,
  isoLocaleCode: string,
  i18n: I18nService,
) {
  const checkPermission =
    await userGroupAssignmentRepository.checkPermissionInGroupSyncData(
      userId,
      groupId,
      Resource.INSPECTIONS_AND_MACHINE_REPORTS,
      Operation.READ_CREATE,
    );

  // Check the user's permission in group
  if (!checkPermission) {
    throw new ForbiddenException({
      message: 'User have not permissions in this group.',
      statusName: StatusName.PERMISSION_ERROR,
    });
  }

  if (
    checkPermission.currentStatus ===
      UserGroupAssignmentCurrentStatus.UNASSIGNED &&
    lastStatusUpdatedAt > checkPermission.lastStatusUpdatedAt
  ) {
    throw new ForbiddenException({
      message: 'User is unassigned in this group.',
      errorType: ErrorType.USER_NOT_FOUND,
      customMessage: i18n.t('message.group.existingDelete', {
        lang: isoLocaleCode,
      }),
      statusName: StatusName.PERMISSION_ERROR,
    });
  }
}

export function convertUTCToTimezone(date: dayjs.Dayjs, tzString: string) {
  const [hour, minute] = tzString.split(':');

  return dayjs(date)
    .add(Number(hour), 'hours')
    .add(Number(hour) > 0 ? Number(minute) : -Number(minute), 'minutes')
    .format();
}

export function convertTimezoneToUTC(date: dayjs.Dayjs, tzString: string) {
  const [hour, minute] = tzString.split(':');

  return dayjs(date)
    .add(-Number(hour), 'hours')
    .add(Number(hour) < 0 ? Number(minute) : -Number(minute), 'minutes')
    .format();
}

export function formatTime(date: dayjs.Dayjs) {
  return date
    .format('A hh:mm')
    .replace(/AM 12:(.{2})/, 'AM 00:$1')
    .replace(/PM 12:(.{2})/, 'PM 00:$1');
}

export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function isAlphabetReporter(givenName: string, surname: string) {
  return ALPHABET_REGEX.test(surname + givenName);
}

export function formatServiceMeter(result: string) {
  return INTEGER_REGEX.test(result) ? result + '.0' : result;
}

export function transformStringNumber(value: string) {
  return value === '' || value === null ? null : +value;
}

export function isNil(value: any) {
  return value === null || value === undefined;
}

export function summaryOrderBys(orderBys: GetMachineSummaryOrderBy[]) {
  const [
    { field = MachineSummarySortByField.REPORTED_AT, order = Order.DESC } = {},
  ] = orderBys ?? [];

  let orderBy = [{ field: field as string, order }];
  switch (field) {
    case MachineSummarySortByField.REPORT_TYPE:
      orderBy = [{ field: 'reportTypeMessage', order }];
      break;
    case MachineSummarySortByField.REPORTER_NAME:
      orderBy = [
        { field: 'surname', order },
        { field: 'givenName', order },
      ];
      break;
  }
  return orderBy as GetMachineSummaryOrderBy[];
}
