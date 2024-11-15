import { ApiResponseOptions, refs } from '@nestjs/swagger';
import { BaseApiResponse } from '@shared/dtos';

import {
  CustomInspectionFormCurrentStatus,
  DeviceCurrentStatus,
  DeviceOS,
  DevicePlatform,
  GroupCurrentStatus,
  GroupMachineCondition,
  InspectionResultType,
  ISOLocaleCode,
  MachineFavoriteResponse,
  MachineReportCurrentStatus,
  MachineReportResponseStatus,
  MachineReportType,
  Platform,
  ReportActionChoiceCode,
  Subtype,
  UserCurrentStatus,
  UserGroupArchiveStatus,
  UserGroupAssignmentCurrentStatus,
} from './enum';

export const defaultExamples = {
  dateOnly: { type: 'string', format: 'date', example: '2023-10-18' },
  yearOnly: { type: 'string', format: 'date', example: '2023' },
  monthYearOnly: { type: 'string', example: '2023-12' },
  dateTime: {
    type: 'string',
    format: 'date-time',
    example: '2023-10-18T02:03:31.000Z',
  },
  permissionIds: {
    type: 'string',
    isArray: true,
    example: ['065D212J34D8MAJ2SZZHN32ZB0', '065EX9ZM6196CQWRT37JHXSW7C'],
  },
  groupIds: {
    type: 'string',
    isArray: true,
    example: ['065D212J34D8MAJ2SZZHN32ZB0', '065EX9ZM6196CQWRT37JHXSW7C'],
  },
  permissions: {
    example: {
      INSPECTIONS_AND_MACHINE_REPORTS: 'CREATE',
      CUSTOM_INSPECTION_FORMS: 'CREATE_UPDATE',
      MACHINES: 'CREATE_UPDATE_DELETE',
      USER_GROUP_ASSIGNMENTS: 'CREATE_UPDATE_DELETE',
    },
  },
  localeCode: {
    description: "Locale code, defines the user's language",
    example: ISOLocaleCode.JA,
    enum: ISOLocaleCode,
  },
  entityId: {
    description: 'A unique and immutable identifier assigned to an entity',
    type: 'string',
    example: '01HCHJ6B2D0Z3EJ66E42KGXCCZ',
  },
  userEmail: {
    description: 'Email address of the user.',
    type: 'string',
    example: 'user@example.com',
  },
  exp: {
    type: 'number',
    example: 1234567890,
  },
  groupQuery: {
    name: 'groupId',
    type: 'string',
    required: false,
    description: 'The ID of the group.',
  },
  userCurrentStatus: {
    description: "Current Status User, defines the user's status",
    example: UserCurrentStatus.CREATED,
    enum: UserCurrentStatus,
  },
  getGroupsQuery: {
    description: 'status archived or unarchived',
    type: 'string',
    enum: UserGroupArchiveStatus,
    example: '?status=ARCHIVED',
    required: false,
  },
  groupCurrentStatus: {
    description: "Current Status Group, defines the group's status",
    example: GroupCurrentStatus.CREATED,
    enum: GroupCurrentStatus,
  },
  machineAssignmentCount: {
    description: 'number of machines in the group',
    type: 'number',
    example: 10,
  },
  userAssignmentCount: {
    description: 'number of user in the group',
    type: 'number',
    example: 10,
  },
  inspectionReportCount: {
    description: 'number of inpsection report',
    type: 'number',
    example: 10,
  },
  userGroupAssignmentCurrentStatus: {
    description: 'The current status of the user in group assignment',
    example: UserGroupAssignmentCurrentStatus.ASSIGNED,
    enum: UserGroupAssignmentCurrentStatus,
  },
  groupIdArray: {
    name: 'groupIds',
    type: 'array',
    isArray: true,
    required: true,
    example: ['065D212J34D8MAJ2SZZHN32ZB0', '065EX9ZM6196CQWRT37JHXSW7C'],
    description: 'Array of groupId',
  },
  irregularMaintenanceItemChoiceIdArray: {
    name: 'irregularMaintenanceItemChoiceIds',
    type: 'array',
    isArray: true,
    required: true,
    example: ['065D212J34D8MAJ2SZZHN32ZB0', '065EX9ZM6196CQWRT37JHXSW7C'],
    description: 'Array of irregularMaintenanceItemChoiceId',
  },
  isAlreadyInGroup: {
    description: 'Flag to check the user already in the group',
    type: 'boolean',
    example: true,
  },
  machineCondition: {
    description: 'Machine condition',
    example: GroupMachineCondition.NORMAL,
    enum: GroupMachineCondition,
  },
  machineFavorite: {
    description:
      'Indicates the status of the favorite operation: CREATED if the machine is favorited, DELETED if the machine is unfavorited.',
    example: MachineFavoriteResponse.CREATED,
    enum: MachineFavoriteResponse,
  },
  modelAndType: {
    description: 'machine model',
    example: 'PC500LC-10',
    type: 'string',
  },
  reportType: {
    description: 'Report Type, defines the report type.',
    example: MachineReportType.MACHINE,
    enum: MachineReportType,
  },
  machineReportMedias: {
    name: 'machineReportMedias',
    type: 'array',
    isArray: true,
    example: [
      {
        fileName: 'machine_name.png',
        mediaUrl: '/machine-reports/12345678-machine_name.png',
        mimeType: 'image/bmp',
        filePath: '/machine-reports/12345678-machine_name.png',
      },
    ],
    description: 'Array of media',
  },
  oilCoolantRefillExchanges: {
    name: 'oilCoolantRefillExchanges',
    type: 'array',
    isArray: true,
    example: [
      {
        oilTypeId: '01J0MJFBVZP7GRF7KQN9XS31AA',
        actionType: 'REFILL',
        fluidInLiters: 99.99,
        comment: '',
      },
    ],
    description: 'Array of oil coolant refill exchange',
  },
  partReplacements: {
    name: 'partReplacements',
    type: 'array',
    isArray: true,
    example: [
      {
        partTypeId: '01J0MJFBVZP7GRF7KQN9XS31AA',
        content: 'Abcd',
        partReplacementMedias: [
          {
            fileName: '1000000679.jpg',
            mediaUrl: 'mediaUrl',
            mimeType: 'image/jpeg',
          },
        ],
      },
    ],
    description: 'Array of oil part replacement',
  },
  devicePlatform: {
    description: 'Device platform of user',
    example: DevicePlatform.IOS,
    enum: DevicePlatform,
  },
  machineReportStatus: {
    description: 'Machine report status response',
    example: MachineReportCurrentStatus.POSTED,
    enum: MachineReportCurrentStatus,
  },
  machineReportResponseStatus: {
    description: 'Machine report response status',
    example: MachineReportResponseStatus.RESOLVED,
    enum: MachineReportResponseStatus,
  },
  subtype: {
    enum: Subtype,
    example: Subtype.STATUS_UPDATES,
    description:
      'DB: `machine_report_responses.subtype` machineReportResponses subtype',
  },
  timeSinceCommentCreation: {
    description: 'The time since the comment was created',
    type: 'string',
    example: '34分前',
  },
  reportActionChoiceIds: {
    type: 'string',
    isArray: true,
    example: ['065D212J34D8MAJ2SZZHN32ZB0', '065EX9ZM6196CQWRT37JHXSW7C'],
  },
  userDevice: {
    deviceType: {
      type: 'string',
      description: 'DB: `devices.device_type`. Device type',
    },
    fcmToken: {
      type: 'string',
      description: 'DB: `devices.fcm_token`. Fcm token',
    },
  },
  inspectionFormName: {
    type: 'string',
    description: 'DB: `custom_inspection_forms.name`. Inspection form name',
  },
  inspectionFormTemplateTranslationName: {
    type: 'string',
    description:
      'DB: `inspection_form_template_translations.inspection_form_template_name`. Inspection form template name',
  },
  createGroupInput: {
    allowNonKomatsuInfoUse: {
      type: 'boolean',
      description:
        'DB: `groups.allow_non_komatsu_info_use` or DB: `group_histories.allow_non_komatsu_info_use`. Group allow_non_komatsu_info_use',
    },
  },
  inspectionFormOutput: {
    inspectionFormId: {
      description:
        'DB: `custom_inspection_forms.custom_inspection_form_id` or DB: `inspection_form_templates.inspection_form_template_id` Inspection form id or DB: `inspections.inspectionId`.',
    },
    name: {
      type: 'string',
      description:
        'DB: `custom_inspection_forms.name` or DB: `inspection_form_template_translations.inspection_form_template_name`. Inspection item name',
    },
    type: {
      type: 'string',
      description:
        '`CUSTOM` for customInspectionFormId `TEMPLATE` for inspectionFormTemplateId `INSPECTION` for inspectionId',
    },
    currentStatus: {
      type: 'string',
      enum: [
        CustomInspectionFormCurrentStatus.DRAFT,
        CustomInspectionFormCurrentStatus.PUBLISHED,
      ],
      nullable: true,
      description:
        'DB: `custom_inspection_forms.current_status` with two value:`DRAFT` and `PUBLISHED` Inspection current status, inspection form template is NULL',
    },
  },
  inspectionItemOutput: {
    inspectionItemId: {
      type: 'string',
      description:
        'DB: `custom_inspection_items.custom_inspection_item_id` or DB: `inspection_item_templates.inspection_item_id`. Inspection item name',
    },
    name: {
      type: 'string',
      description:
        'DB: `custom_inspection_items.name` or DB: `inspection_item_template_translations.item_name`. Inspection item name',
    },
    description: {
      type: 'string',
      description:
        'DB: `custom_inspection_items.description` or DB: `inspection_item_template_translations.item_description`. Inspection item description',
    },
    resultType: {
      type: 'string',
      description:
        'DB: `custom_inspection_items.result_type` or DB: `inspection_item_templates.result_type`. Inspection item result_type, `OK_OR_ANOMARY` : allow select value of `[OK, ANOMARY]`, `NUMERIC` : allow input number , default: `OK_OR_ANOMARY`',
    },
    isRequired: {
      description:
        'DB: `custom_inspection_items.is_required` custom inspection items isRequired',
    },
    isImmutable: {
      type: 'boolean',
      description:
        'DB: `custom_inspection_items.is_immutable` or DB: `inspection_item_templates.is_immutable`. Inspection item is_immutable',
    },
    isForcedRequired: {
      type: 'boolean',
      description:
        'DB: `custom_inspection_items.is_forced_required` or DB: `inspection_item_templates.is_forced_required`. Inspection item is_forced_required',
    },
    itemCode: {
      type: 'string',
      description:
        'DB: `custom_inspection_items` or `inspection_item_templates` or `inspection_results` -> item_code. When resultType = `NUMBER`-> `SERVICE_METER`: Service meter/SMR (h), `ODOMETER`: Odometer (km); when resultType = `OK_OR_ANOMARY` -> item_code: `NULL` ',
    },
  },
  inspectionItemMediaOutput: {
    fileName: {
      type: 'string',
      description:
        'DB: `custom_inspection_item_medias.file_name` Inspection item media file name',
    },
    filePath: {
      type: 'string',
      description:
        'DB: `custom_inspection_item_medias.media_url` Inspection item media file path',
    },
    mediaUrl: {
      type: 'string',
      description: 'DB: `Handle file path and create url with SAS token',
    },
    mimeType: {
      type: 'string',
      description:
        'DB: `custom_inspection_item_medias.mime_type` Inspection item media mime type',
    },
    createdAt: {
      description:
        'DB: `custom_inspection_item_medias.created_at` Inspection item media create_at',
    },
  },
  partReplacementMediaOutput: {
    fileName: {
      type: 'string',
      description:
        'DB: `part_replacement_medias.file_name` Part replacement media file name',
    },
    mediaUrl: {
      type: 'string',
      description: 'DB: `Handle file path and create url with SAS token',
    },
    mimeType: {
      type: 'string',
      description:
        'DB: `part_replacement_medias.mime_type` Part replacement media mime type',
    },
    createdAt: {
      description:
        'DB: `custom_inspection_item_medias.created_at` Inspection item media create_at',
    },
    thumbnail: {
      type: 'string',
      description: 'DB: `Handle file path and create url with SAS token',
    },
  },

  platform: {
    name: 'platform',
    description: 'User usage platform',
    required: false,
    enum: Platform,
  },
  CreateInspectionInput: {
    inspectionFormId: {
      description: 'DB: `custom_inspection_forms.custom_inspection_form_id`',
    },
    lat: {
      type: 'number',
      description: 'DB: `inspections.lat` Inspections lat',
    },
    lng: {
      type: 'number',
      description: 'DB: `inspections.lng` Inspections lng',
    },
    locationAccuracy: {
      type: 'string',
      description:
        'DB: `inspections.locationAccuracy` Inspections locationAccuracy',
    },
    devicePlatform: {
      type: 'string',
      description:
        'DB: `inspections.devicePlatform` Inspections devicePlatform',
    },
    currentStatus: {
      type: 'string',
      description: 'DB: `inspections.currentStatus` Inspections currentStatus',
    },
    inspectionResults: {
      inspectionItemId: {
        description:
          'DB: `custom_inspection_items.custom_inspection_item_id` custom inspection item id',
      },
      result: {
        type: 'string',
        description:
          'DB: `DB:inspection_results.result` inspections results result. `OK`, `ANOMARY`, number, empty string (draft). `OK_OR_ANOMARY` : allow select value of `[OK, ANOMARY]`, `NUMERIC` : allow input number',
      },
      currentStatus: {
        type: 'string',
        description:
          'DB: `DB:inspection_results.currentStatus` inspections results currentStatus',
      },
      machineReport: {
        description:
          'use columns of tables `machine_reports`, `machine_report_responses`, `machine_report_medias`',
      },
      isRequired: {
        description:
          'DB: `DB:custom_inspection_items.is_required` custom inspection items isRequired',
      },
      resultType: {
        description:
          'DB: `DB:custom_inspection_items.result_type` custom inspection items resultType. `OK_OR_ANOMARY` : allow select value of `[OK, ANOMARY]`, `NUMERIC` : allow input number , default: `OK_OR_ANOMARY`',
      },
      itemCode: {
        description:
          'DB: `DB:custom_inspection_items.item_code` . When resultType = `NUMBER`-> `SERVICE_METER`: Service meter/SMR (h), `ODOMETER`: Odometer (km); when resultType = `OK_OR_ANOMARY` -> item_code: `NULL` ',
      },
    },
  },
  message: {
    example: {
      ja: 'Mesage for jp language',
      en: 'Message for the English language',
    },
  },
  updateUserDeviceInput: {
    deviceType: {
      enum: DevicePlatform,
      description: 'DB: `devices.device_type` devices deviceType',
    },
    fcmToken: {
      type: 'string',
      description: 'DB: `devices.fcm_token` devices fcmToken',
    },
  },
  updateUserDeviceOutput: {
    deviceId: {
      description: 'DB: `devices.device_id` devices deviceId',
    },
    userId: {
      type: 'string',
      description: 'DB: `devices.user_id` devices userId',
    },
    deviceType: {
      enum: DevicePlatform,
      description: 'DB: `devices.device_type` devices deviceType',
    },
    fcmToken: {
      type: 'string',
      description: 'DB: `devices.fcm_token` devices fcmToken',
    },
    lastActiveAt: {
      description: 'DB: `devices.last_active_at` devices lastActiveAt',
    },
    currentStatus: {
      enum: DeviceCurrentStatus,
      description: 'DB: `devices.current_status` devices currentStatus',
    },
    lastStatusUpdatedAt: {
      description:
        'DB: `devices.last_status_updated_at` devices lastStatusUpdatedAt',
    },
  },
  machineReport: {
    machineReportId: {
      description:
        'DB: `machine_reports.machine_report_id` machine reports machineReportId',
    },
    reportTitle: {
      type: 'string',
      description:
        'DB: `machine_reports.report_title` machine reports reportTitle',
    },
    firstReportComment: {
      type: 'string',
      description:
        'DB: `machine_report_responses.report_comment` machine report responses firstReportComment',
    },
    currentStatus: {
      enum: MachineReportCurrentStatus,
      description:
        'DB: `machine_reports.current_status` machine reports currentStatus',
    },
    machineId: {
      type: 'string',
      description: 'DB: `machine_reports.machine_id` machine reports machineId',
    },
    syncStatus: {
      type: 'string',
      description: 'Sync status',
    },
    serviceMeterInHour: {
      type: 'string',
      description:
        'DB: `machine_report_responses.service_meter_in_hour` machine report responses serviceMeterInHour.',
    },
  },
  reportActionCode: {
    description: 'Report action code, defines the report action',
    example: ReportActionChoiceCode.REPAIR_REQUEST,
    enum: ReportActionChoiceCode,
  },
  syncMachineReportMedias: {
    name: 'machineReportMedias',
    type: 'array',
    isArray: true,
    example: [
      {
        machineReportMediaId: '01HCHJ6B2D0Z3EJ66E42KGXCCZ',
        fileName: 'machine_name.png',
        mediaUrl: '/machine-reports/12345678-machine_name.png',
        mimeType: 'image/bmp',
        filePath: '/machine-reports/12345678-machine_name.png',
      },
    ],
    description: 'Array of media',
  },
  os: {
    in: 'header',
    name: 'os',
    required: false,
    example: `${DeviceOS.IOS} or ${DeviceOS.ANDROID}`,
  },
  version: {
    in: 'header',
    name: 'version',
    example: '1.0.0',
    required: false,
  },
  inspectionResultType: {
    description: 'inspection result type code, defines the inspection result',
    example: InspectionResultType.ANOMARY,
    enum: InspectionResultType,
  },
  isRequiredForWebapp: {
    description:
      'In webapp platform monthYear and customInspectionFormId are quired',
  },
  timezoneUtc: {
    description: `Timezone UTC, defines the user's timezone UTC`,
    example: '+00:00',
  },

  getReportFilterCountOutput: {
    latestServiceMeter: {
      description: `latest service meter in time`,
    },
    latestServiceMeterUpdatedAt: {
      description: `latest service meter updated at in time`,
    },
    reportCount: { description: `All inspection and machine report` },
    maintenanceReportCount: {
      description: `All maintenance report`,
    },
    incidentReportCount: { description: `All incident report` },
    inspectionReportCount: { description: `All inspection report` },
  },

  getMachineSummaryOutput: {
    reportedId: {
      description: `inspectionId or machineReportId`,
    },
    reportType: {
      description: `type: INSPECTION or INCIDENT_REPORTS or MAINTENANCE_REPORTS`,
    },
    reportTypeMessage: {
      description: `type: INSPECTION or INCIDENT_REPORTS or MAINTENANCE_REPORTS translate message`,
    },
    reportSubType: {
      description: `type: INSPECTION or MACHINE_REPORT when reportType = INCIDENT_REPORTS`,
      nullable: true,
    },
    reportItem: {
      description: `inspection: inspectionForm name, machine report: report title, maintenance: regular_maintenance_item_choice_name`,
    },
    reportResponseStatus: {
      description: `UNADDRESSED or RESOLVED`,
    },
    givenName: {
      description: `information staff`,
    },
    surname: {
      description: `information staff`,
    },
    userPictureUrl: {
      description: `information staff`,
    },
    lat: {
      description: `location`,
    },
    lng: {
      description: `location`,
    },
  },
  getMaintenanceReportDetailOutput: {
    reportItem: {
      description:
        'DB: `regular_maintenance_item_choice_translations.regular_maintenance_item_choice_name` reportItem',
    },
    givenName: {
      description: `staff information`,
    },
    surname: {
      description: `staff information`,
    },
    userPictureUrl: {
      description: `staff information`,
      nullable: true,
    },
    serviceMeterInHour: {
      description:
        'DB: `maintenance_reports.service_meter_in_hour` serviceMeterInHour',
    },
    irregularMaintenanceItemChoiceName: {
      description:
        'DB: `irregular_maintenance_item_choice_translations.irregular_maintenance_item_choice_name` irregularMaintenanceItemChoiceName',
    },
    irregularMaintenanceItemChoiceCode: {
      description:
        'DB: `irregular_maintenance_item_choices.irregular_maintenance_item_choice_code` irregularMaintenanceItemChoiceCode',
    },
    maintenanceReasonChoiceName: {
      description:
        'DB: `maintenance_reason_choice_translations.maintenance_reason_choice_name` maintenanceReasonChoiceName',
    },
    maintenanceReasonPeriodChoiceName: {
      description:
        'DB: `maintenance_reason_period_choice_translations.maintenance_reason_period_choice_name` maintenanceReasonPeriodChoiceName',
    },
    comment: {
      description: 'DB: `maintenance_reports.comment` comment',
    },
  },
};

export function platformOutput(
  appOutput: typeof BaseApiResponse,
  webappOutput: typeof BaseApiResponse,
): ApiResponseOptions {
  return {
    content: {
      'app: application/json': {
        schema: {
          oneOf: refs(appOutput),
          description: 'Application response',
        },
      },
      'webapp: application/json': {
        schema: {
          oneOf: refs(webappOutput),
          description: 'Web application response',
        },
      },
    },
  };
}
