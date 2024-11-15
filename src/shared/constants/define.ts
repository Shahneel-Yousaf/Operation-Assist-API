import { RequestMethod } from '@nestjs/common';

export const dateFormat = {
  dateOnlyFormat: 'YYYY-MM-DD',
  dateTimeFormat: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  yearOnlyFormat: 'YYYY',
  monthYearOnlyFormat: 'YYYY-MM',
};

export const permissions = {
  userGroupAssignment: {
    create: 'USER_GROUP_ASSIGNMENTS.CREATE',
    update: 'USER_GROUP_ASSIGNMENTS.UPDATE',
    read: 'USER_GROUP_ASSIGNMENTS.READ',
    delete: 'USER_GROUP_ASSIGNMENTS.DELETE',
  },
  machine: {
    create: 'MACHINES.CREATE',
    read: 'MACHINES.READ',
    delete: 'MACHINES.DELETE',
    update: 'MACHINES.UPDATE',
  },
  group: {
    update: 'GROUPS.UPDATE',
    delete: 'GROUPS.DELETE',
  },
  inspection: {
    create: 'INSPECTIONS_AND_MACHINE_REPORTS.CREATE',
  },
  customInspectionForm: {
    create: 'CUSTOM_INSPECTION_FORMS.CREATE',
    update: 'CUSTOM_INSPECTION_FORMS.UPDATE',
  },
};

export const apiSyncPaths = [
  '/sync-machine-report-data',
  '/sync-inspection-data',
];

export const excludeRoutes = [
  {
    path: '/:version/health-check',
    method: RequestMethod.ALL,
  },
  {
    path: '/:version/groups/:groupId/machines/:machineId/sync-inspection-data',
    method: RequestMethod.POST,
  },
  {
    path: '/:version/groups/:groupId/machines/:machineId/sync-machine-report-data',
    method: RequestMethod.POST,
  },
];
