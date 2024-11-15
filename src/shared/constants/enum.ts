export enum ISOLocaleCode {
  EN = 'en',
  ES = 'es',
  JA = 'ja',
  PT = 'pt',
  AR = 'ar',
  UR = 'ur',
}

export enum UserGroupAssignmentCurrentStatus {
  ASSIGNED = 'ASSIGNED',
  UNASSIGNED = 'UNASSIGNED',
}

export enum EventType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum InvitationType {
  EMAIL_INVITE = 'EMAIL_INVITE',
  EXISTING_USER_INVITE = 'EXISTING_USER_INVITE',
}

export enum InvitationResponse {
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export enum Resource {
  INSPECTIONS_AND_MACHINE_REPORTS = 'INSPECTIONS_AND_MACHINE_REPORTS',
  CUSTOM_INSPECTION_FORMS = 'CUSTOM_INSPECTION_FORMS',
  MACHINES = 'MACHINES',
  USER_GROUP_ASSIGNMENTS = 'USER_GROUP_ASSIGNMENTS',
  GROUPS = 'GROUPS',
}

export enum Operation {
  READ_CREATE = 'READ_CREATE',
  READ_CREATE_UPDATE = 'READ_CREATE_UPDATE',
  READ_CREATE_UPDATE_DELETE = 'READ_CREATE_UPDATE_DELETE',
  UPDATE_DELETE = 'UPDATE_DELETE',
}

export enum MiddlewareEnum {
  AUTH_GUARD = 'AuthGuard',
  PERMISSION_INTERCEPTOR = 'PermissionInterceptor',
  PATH_PARAMS_CHECK_INTERCEPTOR = 'PathParamsCheckInterceptor',
  RESPONSE_INTERCEPTOR = 'ResponseInterceptor',
}

export enum SasPermissionValue {
  READ = 'r',
  WRITE = 'w',
}

export enum UploadFileType {
  USER = 'users',
  MACHINE = 'machines',
  MACHINE_REPORT = 'machine-reports',
  MACHINE_INSPECTION = 'machine-inspections',
}

export enum UserCurrentStatus {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export enum GroupCurrentStatus {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  UNARCHIVED = 'UNARCHIVED',
  ARCHIVED = 'ARCHIVED',
}

export enum MachineCurrentStatus {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export enum UserGroupArchiveStatus {
  UNARCHIVED = 'UNARCHIVED',
  ARCHIVED = 'ARCHIVED',
}

export enum GroupHistoryEventType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  UNARCHIVE = 'UNARCHIVE',
  ARCHIVE = 'ARCHIVE',
  DELETE = 'DELETE',
}

export enum ErrorType {
  GROUP_NOT_FOUND = 'GroupNotFound',
  USER_NOT_FOUND = 'UserNotFound',
  MACHINE_NOT_FOUND = 'MachineNotFound',
  MACHINE_REPORT_NOT_FOUND = 'MachineReportNotFound',
  INSPECTION_FORM_NOT_FOUND = 'InspectionFormNotFound',
  INSPECTION_FORM_TEMPLATE_NOT_FOUND = 'InspectionFormTemplateNotFound',
  INSPECTION_NOT_FOUND = 'InspectionNotFound',
}

export enum GroupMachineCondition {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export enum MachineFavoriteResponse {
  CREATED = 'CREATED',
  DELETED = 'DELETED',
}

export enum MachineHistoryEventType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum GroupMachineAssignmentHistoryEventType {
  ASSIGNED = 'ASSIGNED',
  UNASSIGNED = 'UNASSIGNED',
}

export enum MachineReportType {
  MACHINE = 'MACHINE',
  INSPECTION = 'INSPECTION',
}

export enum MachineHistoryType {
  MACHINE_REPORTS = 'MACHINE_REPORTS',
  INSPECTIONS = 'INSPECTIONS',
  INSPECTION_FORM = 'INSPECTION_FORM',
  MAINTENANCE_REPORTS = 'MAINTENANCE_REPORTS',
}

export enum DevicePlatform {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
  WEB = 'WEB',
}

export enum MachineReportCurrentStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  UPDATED = 'UPDATED',
}

export enum UserGroupAssignmentHistoryEventType {
  ASSIGNED = 'ASSIGNED',
  UNASSIGNED = 'UNASSIGNED',
}

export enum MachineReportResponseStatus {
  UNADDRESSED = 'UNADDRESSED',
  RESOLVED = 'RESOLVED',
}

export enum CustomInspectionFormCurrentStatus {
  DELETED = 'DELETED',
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}

export enum CustomInspectionItemResultType {
  OK_OR_ANOMARY = 'OK_OR_ANOMARY',
  NUMERIC = 'NUMERIC',
}

export enum Platform {
  WEBAPP = 'WEBAPP',
  MOBILE_APP = 'MOBILE_APP',
}

export enum InspectionCurrentStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum GroupSortByField {
  GROUP_NAME = 'groupName',
  MACHINE_COUNT = 'machineCount',
  REPORT_COUNT = 'reportCount',
  INSPECTION_FORM_COUNT = 'inspectionFormCount',
  MEMBER_COUNT = 'memberCount',
}

export enum InspectionFormType {
  CUSTOM = 'CUSTOM',
  TEMPLATE = 'TEMPLATE',
  INSPECTION = 'INSPECTION',
}

export enum InspectionResultType {
  OK = 'OK',
  ANOMARY = 'ANOMARY',
}

export enum MachineSortByField {
  MACHINE_NAME = 'machineName',
  MODEL_AND_TYPE = 'modelAndType',
  MACHINE_MANUFACTURER_NAME = 'machineManufacturerName',
  MACHINE_TYPE = 'machineType',
}

export enum NotificationStatus {
  SENT = 'SENT',
  QUEUED = 'QUEUED',
  FAILED = 'FAILED',
}

export enum NotificationContentCode {
  INSPECTION_POSTED = 'INSPECTION_POSTED',
  INCIDENT_REPORT_POSTED = 'INCIDENT_REPORT_POSTED',
  INCIDENT_REPORT_UPDATED_AND_UNADDRESSED = 'INCIDENT_REPORT_UPDATED_AND_UNADDRESSED',
  INCIDENT_REPORT_UPDATED_AND_RESOLVED = 'INCIDENT_REPORT_UPDATED_AND_RESOLVED',
  MAINTENANCE_REPORT_POSTED = 'MAINTENANCE_REPORT_POSTED',
  MACHINE_OPERATION_REPORT_POSTED = 'MACHINE_OPERATION_REPORT_POSTED',
  FUEL_MAINTENANCE_REPORT_POSTED = 'FUEL_MAINTENANCE_REPORT_POSTED',
}

export enum NotificationType {
  INSPECTION = 'INSPECTION',
  MACHINE_REPORT = 'MACHINE_REPORT',
  MAINTENANCE_REPORT = 'MAINTENANCE_REPORT',
}

export enum ParamEnum {
  CUSTOM_INSPECTION_FORM_ID = 'customInspectionFormId',
}

export enum ItemCodeType {
  SERVICE_METER = 'SERVICE_METER',
  ODOMETER = 'ODOMETER',
}

export enum DeviceCurrentStatus {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export enum ReportActionChoiceCode {
  SELF_REPAIR = 'SELF_REPAIR',
  REPAIR_REQUEST = 'REPAIR_REQUEST',
}

export enum MachineReportSortByField {
  REPORTED_AT = 'reportedAt',
  REPORT_TYPE = 'reportType',
  REPORT_TITLE = 'reportTitle',
  REPORTER_NAME = 'reporterName',
  REPORT_RESPONSE_STATUS = 'reportResponseStatus',
}

export enum DeviceOS {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
}

export enum GroupInspectionFormSortByField {
  MACHINE_NAME = 'machineName',
  INSPECTION_FORM_NAME = 'inspectionFormName',
  LAST_STATUS_UPDATED_AT = 'lastStatusUpdatedAt',
  UPDATED_BY = 'updatedBy',
}

export enum ResidenceCountryCode {
  BR = 'BR',
  CL = 'CL',
  CO = 'CO',
  EG = 'EG',
  JP = 'JP',
  PH = 'PH',
  SA = 'SA',
  AE = 'AE',
  O = 'O',
}

export enum MachineField {
  MACHINE_NAME = 'machineName',
}

export enum StatusName {
  INVALID_DATA = 'INVALID_DATA',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  SYNCED = 'SYNCED',
  SYNCED_FAILED = 'SYNCED_FAILED',
}

export enum InspectionFormHistoryCurrentStatus {
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  DRAFT = 'DRAFT',
}

export enum Subtype {
  MACHINE_OPERATION_REPORTS = 'MACHINE_OPERATION_REPORTS',
  FUEL_MAINTENANCE_REPORTS = 'FUEL_MAINTENANCE_REPORTS',
  INSPECTION_NORMAL_COMMENTS = 'INSPECTION_NORMAL_COMMENTS',
  INCIDENT_REPORTS = 'INCIDENT_REPORTS',
  STATUS_UPDATES = 'STATUS_UPDATES',
  MAINTENANCE_REPORTS = 'MAINTENANCE_REPORTS',
}

export enum MachineSummarySortByField {
  REPORTED_AT = 'reportedAt',
  REPORT_TYPE = 'reportType',
  REPORT_ITEM = 'reportItem',
  REPORT_RESPONSE_STATUS = 'reportResponseStatus',
  SERVICE_METER = 'serviceMeter',
  REPORTER_NAME = 'reporterName',
}

export enum MachineSummaryType {
  INCIDENT_REPORTS = 'INCIDENT_REPORTS',
  INSPECTION = 'INSPECTION',
  MAINTENANCE_REPORTS = 'MAINTENANCE_REPORTS',
}

export enum ActionType {
  REFILL = 'REFILL',
  EXCHANGE = 'EXCHANGE',
}

export enum MaintenanceReasonChoiceCode {
  SMR_ELAPSE = 'SMR_ELAPSE',
  PERIOD_ELAPSE = 'PERIOD_ELAPSE',
  IRREGULAR = 'IRREGULAR',
}

export enum Version {
  V1 = 'v1',
}
