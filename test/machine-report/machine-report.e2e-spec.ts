import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { FirebaseService } from '@firebase/services/firebase.service';
import { Group } from '@group/entities';
import { Machine } from '@machine/entities';
import {
  MachineOperationReport,
  MachineReport,
  MachineReportResponse,
} from '@machine-report/entities';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  MiddlewareConsumer,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import {
  ISOLocaleCode,
  Platform,
  VALIDATION_PIPE_OPTIONS,
} from '@shared/constants';
import { AuthGuard } from '@shared/guards/auth.guard';
import {
  User,
  UserCiamLink,
  UserGroupAssignment,
  UserGroupPermissionAssignment,
  UserGroupSetting,
} from '@user/entities';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import typeOrmConfig from '../../ormconfig.test';
import { AppModule } from '../../src/app.module';
import {
  group,
  groupSecond,
  machine,
  machineOperationReport,
  machineReport,
  machineReportResponse,
  mockGroupId,
  mockMachineId,
  mockMachineReportId,
  user,
  userCiam,
  userGroupAssignment,
  userGroupPermissionAssignment,
  userGroupSetting,
} from '../mock/data.mock';
import { mockAuthGuard } from '../mock/guard.mock';
import { clearDatabase, createRecord, TableRecord } from '../test-utils';

describe('MachineReportController (e2e): Unauthorized', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BlobStorageService)
      .useValue({})
      .overrideProvider(FirebaseService)
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    const appModule = app.get(AppModule);
    appModule.configure = function (consumer: MiddlewareConsumer) {
      consumer
        .apply((req, res, next) => {
          next();
        })
        .forRoutes('*');
    };
    await app.init();
  });

  describe('(PUT) /groups/:groupId/machines/:machineId/machine-reports/:machineReportId/read-status', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .put(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports/${mockMachineReportId}/read-status`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .put(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports/${mockMachineReportId}/read-status`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(POST) /groups/:groupId/machines/:machineId/machine-reports', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .post(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .post(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /groups/:groupId/machines/:machineId/machine-reports/:machineReportId/read-status', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .put(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports/${mockMachineReportId}/read-status`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .put(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports/${mockMachineReportId}/read-status`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /groups/:groupId/machines/:machineId/machine-reports', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(`/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(`/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
  describe('(GET) /groups/:groupId/machines/:machineId/machine-reports/:machineReportId', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports/${mockMachineReportId}`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports/${mockMachineReportId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(POST) /groups/:groupId/machines/:machineId/machine-operation-reports', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .post(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-operation-reports`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .post(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-operation-reports`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /groups/:groupId/machines/:machineId/machine-operation-reports/:machineReportId', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-operation-reports/${mockMachineReportId}`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-operation-reports/${mockMachineReportId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('MachineReportController (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource;
  beforeAll(async () => {
    connection = await typeOrmConfig.initialize();
    await clearDatabase(connection, [
      'groups',
      'users',
      'user_ciam_links',
      'user_group_assignments',
    ]);
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideProvider(BlobStorageService)
      .useValue({ generateSasUrl: (image: string) => image })
      .overrideProvider(FirebaseService)
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {
        excludeExtraneousValues: true,
        ignoreDecorators: true,
      }),
    );
    const appModule = app.get(AppModule);
    appModule.configure = function (consumer: MiddlewareConsumer) {
      consumer
        .apply((req, res, next) => {
          next();
        })
        .forRoutes('*');
    };
    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase(connection, [
      'groups',
      'users',
      'user_ciam_links',
      'user_group_assignments',
    ]);
  });

  const groupId = group.groupId;
  const machineId = machine.machineId;
  const machineReportId = machineReport.machineReportId;

  const recordInsert: TableRecord[] = [
    {
      entity: Group,
      data: group,
    },
    {
      entity: User,
      data: user,
    },
    {
      entity: UserCiamLink,
      data: userCiam,
    },
    {
      entity: UserGroupAssignment,
      data: userGroupAssignment,
    },
    {
      entity: UserGroupPermissionAssignment,
      data: userGroupPermissionAssignment,
    },
    {
      entity: UserGroupSetting,
      data: userGroupSetting,
    },
    {
      entity: Group,
      data: groupSecond,
    },
    {
      entity: Machine,
      data: machine,
    },
    {
      entity: MachineReport,
      data: machineReport,
    },
    {
      entity: MachineReportResponse,
      data: machineReportResponse,
    },
    {
      entity: MachineOperationReport,
      data: machineOperationReport,
    },
  ];

  describe('(PUT) /groups/:groupId/machines/:machineId/machine-reports/:machineReportId/read-status', () => {
    it('Should return not found when machine not found ', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${mockMachineId}/machine-reports/${machineReportId}/read-status`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return not found when machine report not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machineId}/machine-reports/${mockMachineReportId}/read-status`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine report not found or not in this machine.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return update read mark for machine report success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machineId}/machine-reports/${machineReportId}/read-status`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {},
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: true,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: true,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_group_permission_assignments',
        'user_group_settings',
        'user_group_assignments',
        'user_ciam_links',
        'machine_reports',
        'machines',
        'users',
        'groups',
      ]);
    });
  });

  describe('(POST) /groups/${mockGroupId}/machines/${mockMachineId}/machine-reports', () => {
    it('Should return not found when machine not found ', async () => {
      const input = {
        reportTitle: 'invalid format',
      };

      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines/${mockMachineId}/machine-reports`)
        .send(input)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return bad request when the request form have not reportComment or machineReportMedias', async () => {
      const input = {
        reportTitle: 'invalid format',
      };

      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines/${machineId}/machine-reports`)
        .send(input)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'The request form must have at least one field.',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Should return create machine report susscess', async () => {
      const input = {
        reportTitle: 'invalid format',
        reportComment: 'report comment',
      };

      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines/${machineId}/machine-reports`)
        .send(input)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.meta.successMessage).toContain(
            'Registered successfully.',
          );
          expect(res.statusCode).toEqual(HttpStatus.CREATED);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'machine_report_histories',
        'user_group_permission_assignments',
        'user_group_settings',
        'user_group_assignments',
        'user_ciam_links',
        'machine_reports',
        'machines',
        'users',
        'groups',
      ]);
    });
  });

  describe('(PUT) /groups/:groupId/machines/:machineId/machine-reports/:machineReportId/read-status', () => {
    it('Should return not found when machine not found ', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${mockMachineId}/machine-reports/${machineReportId}/read-status`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return not found when machine report not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machineId}/machine-reports/${mockMachineReportId}/read-status`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine report not found or not in this machine.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return update read mark for machine report success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machineId}/machine-reports/${machineReportId}/read-status`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {},
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: true,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: true,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_group_permission_assignments',
        'user_group_settings',
        'user_group_assignments',
        'user_ciam_links',
        'machine_reports',
        'machines',
        'users',
        'groups',
      ]);
    });
  });

  describe('(GET) /groups/:groupId/machines/:machineId/machine-reports', () => {
    it('Should return not found when group not found', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });
    it('Should return not found when machine not found ', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines/${mockMachineId}/machine-reports`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Get list machine report: success', async () => {
      const firstRequestTime = '2024-03-28T02:46:04.511Z';
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${machineId}/machine-reports?firstRequestTime=${firstRequestTime}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: [],
            meta: {
              pageInfo: {
                firstRequestTime,
                nextPage: false,
                page: 1,
              },
              screenPermission: {
                allowCreateEditDeleteInspectionForm: true,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: true,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Get list machine report webApp: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines/${machineId}/machine-reports`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .set('platform', Platform.WEBAPP)
        .expect((res) => {
          expect(res.body).toEqual({
            data: [],
            meta: {
              pageInfo: {
                nextPage: false,
                page: 1,
                total: 0,
              },
              screenPermission: {
                allowCreateEditDeleteInspectionForm: true,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: true,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_group_permission_assignments',
        'user_group_settings',
        'user_group_assignments',
        'user_ciam_links',
        'machine_reports',
        'machines',
        'users',
        'groups',
      ]);
    });
  });

  describe('(GET) /groups/:groupId/machines/:machineId/machine-reports/:machineReportId', () => {
    it('Should return not found when group not found', async () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-reports/${mockMachineReportId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });
    it('Should return not found when machine not found ', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${mockMachineId}/machine-reports/${mockMachineReportId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });
    it('Should return not found when machine report not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${machineId}/machine-reports/${mockMachineReportId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine report not found or not in this machine.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Get machine report detail: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${machineId}/machine-reports/${machineReportId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {
              isRead: true,
              machineReportId: machineReport.machineReportId,
              machineReportResponses: [
                {
                  commentedAt: machineReportResponse.commentedAt.toISOString(),
                  givenName: 'givenName',
                  isChangeStatus: false,
                  machineReportMedias: [],
                  machineReportResponseId:
                    machineReportResponse.machineReportResponseId,
                  reportComment: machineReportResponse.reportComment,
                  reportResponseStatus: machineReportResponse.status,
                  surname: 'surname',
                  timeSinceCommentCreation: '1 minute ago',
                  userId: machineReportResponse.userId,
                  userPictureUrl: 'https://picsum.photos/id/1/200/200',
                  subtype: 'STATUS_UPDATES',
                  serviceMeterInHour: null,
                },
              ],
              reportResponseStatus: machineReportResponse.status,
              reportStatus: machineReport.currentStatus,
              reportTitle: machineReport.reportTitle,
              reportedAt: machineReportResponse.commentedAt.toISOString(),
            },
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: true,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: true,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_group_permission_assignments',
        'user_group_settings',
        'user_group_assignments',
        'user_ciam_links',
        'machine_reports',
        'machines',
        'users',
        'groups',
        'machine_report_responses',
      ]);
    });
  });

  describe('(POST) /groups/:groupId/machines/:machineId/machine-operation-reports', () => {
    it('Should return not found when machine not found', async () => {
      const input = {
        reportTitle: 'invalid format',
      };

      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .post(
          `/groups/${groupId}/machines/${mockMachineId}/machine-operation-reports`,
        )
        .send(input)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return create machine operation report susscess', async () => {
      const input = {
        lat: '0.123',
        lng: '0.123',
        locationAccuracy: 'string',
        devicePlatform: 'IOS',
        startAt: '2024-06-04T03:31:19.000Z',
        endAt: '2024-05-04T03:31:19.000Z',
        operationDetail: 'operationDetail',
        comment: 'comment',
      };

      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .post(
          `/groups/${groupId}/machines/${machineId}/machine-operation-reports`,
        )
        .send(input)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.meta.successMessage).toContain(
            'Registered successfully.',
          );
          expect(res.statusCode).toEqual(HttpStatus.CREATED);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'machine_report_histories',
        'user_group_permission_assignments',
        'user_group_settings',
        'user_group_assignments',
        'user_ciam_links',
        'machine_reports',
        'machines',
        'users',
        'groups',
      ]);
    });
  });

  describe('(GET) /groups/:groupId/machines/:machineId/machine-operation-reports/:machineReportId', () => {
    it('Should return not found when group not found', async () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/machine-operation-reports/${mockMachineReportId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return not found when machine not found ', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${mockMachineId}/machine-operation-reports/${mockMachineReportId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return not found when machine report not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${machineId}/machine-operation-reports/${mockMachineReportId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine report not found or not in this machine.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Get machine operation report detail: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${machineId}/machine-operation-reports/${machineReportId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {
              machineReportId: machineReport.machineReportId,
              reportTitle: 'title',
              reportedAt: machineReportResponse.commentedAt.toISOString(),
              subtype: 'STATUS_UPDATES',
              userId: user.userId,
              givenName: user.givenName,
              surname: user.surname,
              userPictureUrl: 'https://picsum.photos/id/1/200/200',
              machineReportResponseId:
                machineReportResponse.machineReportResponseId,
              timeSinceCommentCreation: '1 minute ago',
              lat: null,
              lng: null,
              locationAccuracy: null,
              devicePlatform: null,
              startAt: machineOperationReport.startAt.toISOString(),
              endAt: machineOperationReport.endAt.toISOString(),
              operationDetail: 'operationDetails',
              comment: 'comment',
            },
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: true,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: true,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_group_permission_assignments',
        'user_group_settings',
        'user_group_assignments',
        'user_ciam_links',
        'machine_reports',
        'machines',
        'users',
        'groups',
        'machine_report_responses',
        'machine_operation_reports',
      ]);
    });
  });

  afterAll(async () => {
    await clearDatabase(connection, [
      'user_ciam_links',
      'group_invitations',
      'user_group_assignments',
      'machines',
      'users',
      'groups',
    ]);
    await app.close();
    await connection.destroy();
  });
});
