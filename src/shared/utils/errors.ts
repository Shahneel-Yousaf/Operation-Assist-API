import { Group } from '@group/entities';
import { CustomInspectionForm, Inspection } from '@inspection/entities';
import { Machine } from '@machine/entities';
import { MachineReport } from '@machine-report/entities';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  CustomInspectionFormCurrentStatus,
  ErrorType,
  GroupCurrentStatus,
  MachineCurrentStatus,
  StatusName,
  UserCurrentStatus,
  UserGroupAssignmentCurrentStatus,
} from '@shared/constants';
import { User, UserGroupAssignment } from '@user/entities';
import { I18nService } from 'nestjs-i18n';

export function checkGroupNotFound(
  group: Group,
  isoLocaleCode: string,
  i18n: I18nService,
  status: number = HttpStatus.NOT_FOUND,
) {
  if (!group) {
    throw new HttpException(
      {
        message: 'Group not found or does not belong to this user.',
        errorType: ErrorType.GROUP_NOT_FOUND,
      },
      status,
    );
  }

  if (group.currentStatus === GroupCurrentStatus.DELETED) {
    throw new HttpException(
      {
        message: 'The group has been deleted.',
        errorType: ErrorType.GROUP_NOT_FOUND,
        customMessage: i18n.t('message.group.existingDelete', {
          lang: isoLocaleCode,
        }),
        isDeleted: true,
      },
      status,
    );
  }
}

export function checkUserGroupAssignmentNotFound(
  userAssignment: UserGroupAssignment,
  isoLocaleCode: string,
  i18n: I18nService,
  status: number = HttpStatus.NOT_FOUND,
) {
  if (!userAssignment) {
    throw new HttpException(
      {
        message: 'User not found or not in this group.',
        errorType: ErrorType.USER_NOT_FOUND,
      },
      status,
    );
  }

  if (
    userAssignment.currentStatus === UserGroupAssignmentCurrentStatus.UNASSIGNED
  ) {
    throw new HttpException(
      {
        message: 'The user has been unassigned from the group.',
        errorType: ErrorType.USER_NOT_FOUND,
        customMessage: i18n.t('message.group.existingDelete', {
          lang: isoLocaleCode,
        }),
      },
      status,
    );
  }

  if (userAssignment.user?.currentStatus === UserCurrentStatus.DELETED) {
    throw new HttpException(
      {
        message: 'The user has been deleted.',
        errorType: ErrorType.USER_NOT_FOUND,
        customMessage: i18n.t('message.group.existingDelete', {
          lang: isoLocaleCode,
        }),
        isDeleted: true,
      },
      status,
    );
  }
}

export function checkMachineNotFound(
  machine: Machine,
  isoLocaleCode: string,
  i18n: I18nService,
  status: number = HttpStatus.NOT_FOUND,
) {
  if (!machine) {
    throw new HttpException(
      {
        message: 'Machine not found or not in this group.',
        errorType: ErrorType.MACHINE_NOT_FOUND,
      },
      status,
    );
  }

  if (machine.currentStatus === MachineCurrentStatus.DELETED) {
    throw new HttpException(
      {
        message: 'The machine has been deleted.',
        errorType: ErrorType.MACHINE_NOT_FOUND,
        customMessage: i18n.t('message.group.existingDelete', {
          lang: isoLocaleCode,
        }),
        isDeleted: true,
      },
      status,
    );
  }
}

export function checkInspectionNotFound(
  inspection: Inspection,
  status: number = HttpStatus.NOT_FOUND,
) {
  if (!inspection) {
    throw new HttpException(
      {
        message: 'Inspection not found or not in this machine.',
        errorType: ErrorType.INSPECTION_NOT_FOUND,
      },
      status,
    );
  }
}

export function checkMachineReportNotFound(
  machineReport: MachineReport,
  status: number = HttpStatus.NOT_FOUND,
) {
  if (!machineReport) {
    throw new HttpException(
      {
        message: 'Machine report not found or not in this machine.',
        errorType: ErrorType.MACHINE_REPORT_NOT_FOUND,
      },
      status,
    );
  }
}

export function checkCustomInspectionFormNotFound(
  customInspectionForm: CustomInspectionForm,
  isoLocaleCode: string,
  i18n: I18nService,
  status: number = HttpStatus.NOT_FOUND,
) {
  if (!customInspectionForm) {
    throw new HttpException(
      {
        message: 'Custom inspection form not found or not in this machine.',
        errorType: ErrorType.INSPECTION_FORM_NOT_FOUND,
      },
      status,
    );
  }

  if (
    customInspectionForm.currentStatus ===
    CustomInspectionFormCurrentStatus.DELETED
  ) {
    throw new HttpException(
      {
        message: 'The custom inspection form has been deleted.',
        errorType: ErrorType.INSPECTION_FORM_NOT_FOUND,
        customMessage: i18n.t('message.inspectionForm.existingDelete', {
          lang: isoLocaleCode,
        }),
        isDeleted: true,
      },
      status,
    );
  }
}

export function checkUserNotFound(
  user: User,
  isoLocaleCode: string,
  i18n: I18nService,
  status: number = HttpStatus.NOT_FOUND,
) {
  if (!user) {
    throw new HttpException(
      {
        message: 'User not exist.',
        errorType: ErrorType.USER_NOT_FOUND,
      },
      status,
    );
  }

  if (user.currentStatus === UserCurrentStatus.DELETED) {
    throw new HttpException(
      {
        message: 'User has been deleted.',
        errorType: ErrorType.USER_NOT_FOUND,
        customMessage: i18n.t('message.user.existingDelete', {
          lang: isoLocaleCode,
        }),
        isDeleted: true,
      },
      status,
    );
  }
}

export function checkInvalidSyncData(
  group: Group,
  isoLocaleCode: string,
  i18n: I18nService,
  lastStatusUpdatedAt: Date,
  status: number = HttpStatus.NOT_FOUND,
) {
  if (!group) {
    throw new HttpException(
      {
        message: 'Group not found or does not belong to this user.',
        errorType: ErrorType.GROUP_NOT_FOUND,
        statusName: StatusName.INVALID_DATA,
      },
      status,
    );
  }

  if (
    group.currentStatus === GroupCurrentStatus.DELETED &&
    lastStatusUpdatedAt > group.lastStatusUpdatedAt
  ) {
    throw new HttpException(
      {
        message: 'The group has been deleted.',
        errorType: ErrorType.GROUP_NOT_FOUND,
        customMessage: i18n.t('message.group.existingDelete', {
          lang: isoLocaleCode,
        }),
        statusName: StatusName.INVALID_DATA,
        isDeleted: true,
      },
      status,
    );
  }

  if (!group.machines.length) {
    throw new HttpException(
      {
        message: 'Machine not found or not in this group.',
        errorType: ErrorType.MACHINE_NOT_FOUND,
        statusName: StatusName.INVALID_DATA,
      },
      status,
    );
  }

  if (
    group.machines[0].currentStatus === MachineCurrentStatus.DELETED &&
    lastStatusUpdatedAt > group.machines[0].lastStatusUpdatedAt
  ) {
    throw new HttpException(
      {
        message: 'Machine has been deleted.',
        errorType: ErrorType.MACHINE_NOT_FOUND,
        customMessage: i18n.t('message.machine.existingDelete', {
          lang: isoLocaleCode,
        }),
        statusName: StatusName.INVALID_DATA,
        isDeleted: true,
      },
      status,
    );
  }
}
