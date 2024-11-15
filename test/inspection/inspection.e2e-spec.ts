import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { FirebaseService } from '@firebase/services/firebase.service';
import { Group } from '@group/entities';
import {
  CustomInspectionForm,
  CustomInspectionFormHistory,
  CustomInspectionItem,
  CustomInspectionItemHistory,
  Inspection,
  InspectionHistory,
  InspectionResult,
} from '@inspection/entities';
import { Machine } from '@machine/entities';
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
  CustomInspectionFormCurrentStatus,
  CustomInspectionItemResultType,
  DevicePlatform,
  EventType,
  GroupCurrentStatus,
  InspectionCurrentStatus,
  InspectionFormType,
  ISOLocaleCode,
  MachineCurrentStatus,
  UserCurrentStatus,
  UserGroupAssignmentCurrentStatus,
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
import { ulid } from 'ulid';

import typeOrmConfig from '../../ormconfig.test';
import { AppModule } from '../../src/app.module';
import {
  customInspectionForm,
  group,
  groupSecond,
  inspection,
  machine,
  mockCustomInspectionFormId,
  mockGroupId,
  mockInspectionFormTemplateId,
  mockInspectionId,
  mockMachineId,
  user,
  userCiam,
  userGroupAssignment,
  userGroupPermissionAssignment,
  userGroupSetting,
} from '../mock/data.mock';
import { mockAuthGuard } from '../mock/guard.mock';
import { clearDatabase, createRecord, TableRecord } from '../test-utils';

describe('InspectionController (e2e): Unauthorized', () => {
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

  describe('(DELETE) /groups/:groupId/machines/:machineId/inspection-forms/:customInspectionFormId', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .delete(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-forms/${mockCustomInspectionFormId}`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .delete(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-forms/${mockCustomInspectionFormId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(POST) /groups/:groupId/machines/:machineId/inspection-forms', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .post(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-forms`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .post(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-forms`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /groups/:groupId/machines/:machineId/inspections/:inspectionId', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .put(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspections/${mockInspectionId}`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .put(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspections/${mockInspectionId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /groups/:groupId/machines/:machineId/user-inspection-form-drafts', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/user-inspection-form-drafts`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/user-inspection-form-drafts`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /groups/:groupId/machines/:machineId/inspection-form-templates/:inspectionFormTemplateId', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-form-templates/${mockInspectionFormTemplateId}`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-form-templates/${mockInspectionFormTemplateId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(POST) /groups/:groupId/machines/:machineId/inspections', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .post(`/groups/${mockGroupId}/machines/${mockMachineId}/inspections`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .post(`/groups/${mockGroupId}/machines/${mockMachineId}/inspections`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /groups/:groupId/machines/:machineId/inspection-form-templates', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-form-templates`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-form-templates`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /groups/:groupId/machines/:machineId/inspection-forms/:customInspectionFormId', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .put(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-forms/${mockCustomInspectionFormId}`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .put(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-forms/${mockCustomInspectionFormId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /groups/:groupId/machines/:machineId/inspections/:inspectionId', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspections/${mockInspectionId}`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspections/${mockInspectionId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('InspectionController (e2e)', () => {
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
  const customInspectionFormId = customInspectionForm.customInspectionFormId;
  const inspectionId = inspection.inspectionId;
  const inspectionFormTemplateId = '01HK75F5HZFJ44679AV6H115CW';

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
      entity: CustomInspectionForm,
      data: customInspectionForm,
    },
    {
      entity: Inspection,
      data: inspection,
    },
  ];

  describe('(DELETE) /groups/:groupId/machines/:machineId/inspection-forms/:customInspectionFormId', () => {
    const user = {
      userId: ulid(),
      searchId: '000000002',
      givenName: 'givenName',
      surname: 'surname',
      pictureUrl: 'pictureUrl',
      email: 'invitee@example.com',
      isSearchableByEmail: true,
      registeredAt: new Date(),
      isoLocaleCode: ISOLocaleCode.EN,
      residenceCountryCode: 'JA',
      dateOfBirth: '2023',
      currentStatus: UserCurrentStatus.CREATED,
      lastStatusUpdatedAt: new Date(),
    };
    const userCiamLink = {
      userCiamLinkId: 'USERCIAMLINKH6WB1N6G6AFVBD',
      userId: user.userId,
      oid: 'example_oid',
      iss: 'https://exampleiss.com/oid',
      linkedAt: new Date(),
    };
    const group = {
      groupId: ulid(),
      groupName: 'groupName',
      location: 'location',
      currentStatus: GroupCurrentStatus.CREATED,
      lastStatusUpdatedAt: new Date(),
      companyName: 'company name',
    };
    const userGroupAssignment = {
      groupId: group.groupId,
      userId: user.userId,
      lastStatusUpdatedAt: new Date(),
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      userGroupRoleName: 'groupName',
      location: 'location',
      userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
    };
    const userGroupPermissionAssignment = {
      groupId: group.groupId,
      userId: user.userId,
      permissionId: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      assignedAt: new Date(),
    };
    const machine = {
      machineId: ulid(),
      machineName: 'machinename',
      pictureUrl: 'string',
      modelAndType: 'DFSEFRE',
      serialNumber: 'serial number',
      serialNumberPlatePictureUrl: '',
      currentStatus: MachineCurrentStatus.CREATED,
      lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
      machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
      machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
      groupId: group.groupId,
    };
    const customInspectionForm = {
      customInspectionFormId: ulid(),
      name: 'inspection name',
      machineId: machine.machineId,
      currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
      lastStatusUpdatedAt: new Date(),
    };

    const recordInsert: TableRecord[] = [
      {
        entity: User,
        data: user,
      },
      {
        entity: UserCiamLink,
        data: userCiamLink,
      },
      {
        entity: Group,
        data: group,
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
        entity: Machine,
        data: machine,
      },
      {
        entity: CustomInspectionForm,
        data: customInspectionForm,
      },
    ];

    it('Should return not found when machine not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .delete(
          `/groups/${group.groupId}/machines/${mockMachineId}/inspection-forms/${customInspectionFormId}`,
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

    it('Should return not found when custom inspection form not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .delete(
          `/groups/${group.groupId}/machines/${machine.machineId}/inspection-forms/${mockCustomInspectionFormId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Custom inspection form not found or not in this machine.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return update read mark for machine report success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .delete(
          `/groups/${group.groupId}/machines/${machine.machineId}/inspection-forms/${customInspectionForm.customInspectionFormId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {},
            meta: {
              successMessage: 'Deleted successfully.',
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateEditDeleteInspectionForm: true,
                allowCreateInspectionAndReport: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'inspections',
        'custom_inspection_forms',
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

  describe('(POST) /groups/:groupId/machines/:machineId/inspection-forms', () => {
    const user = {
      userId: ulid(),
      searchId: '000000002',
      givenName: 'givenName',
      surname: 'surname',
      pictureUrl: 'pictureUrl',
      email: 'invitee@example.com',
      isSearchableByEmail: true,
      registeredAt: new Date(),
      isoLocaleCode: ISOLocaleCode.EN,
      residenceCountryCode: 'JA',
      dateOfBirth: '2023',
      currentStatus: UserCurrentStatus.CREATED,
      lastStatusUpdatedAt: new Date(),
    };
    const userCiamLink = {
      userCiamLinkId: 'USERCIAMLINKH6WB1N6G6AFVBD',
      userId: user.userId,
      oid: 'example_oid',
      iss: 'https://exampleiss.com/oid',
      linkedAt: new Date(),
    };
    const group = {
      groupId: ulid(),
      groupName: 'groupName',
      location: 'location',
      currentStatus: GroupCurrentStatus.CREATED,
      lastStatusUpdatedAt: new Date(),
      companyName: 'company name',
    };
    const userGroupAssignment = {
      groupId: group.groupId,
      userId: user.userId,
      lastStatusUpdatedAt: new Date(),
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      userGroupRoleName: 'groupName',
      location: 'location',
      userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
    };
    const userGroupPermissionAssignment = {
      groupId: group.groupId,
      userId: user.userId,
      permissionId: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      assignedAt: new Date(),
    };
    const machine = {
      machineId: ulid(),
      machineName: 'machinename',
      pictureUrl: 'string',
      modelAndType: 'DFSEFRE',
      serialNumber: 'serial number',
      serialNumberPlatePictureUrl: '',
      currentStatus: MachineCurrentStatus.CREATED,
      lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
      machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
      machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
      groupId: group.groupId,
    };

    const recordInsert: TableRecord[] = [
      {
        entity: User,
        data: user,
      },
      {
        entity: UserCiamLink,
        data: userCiamLink,
      },
      {
        entity: Group,
        data: group,
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
        entity: Machine,
        data: machine,
      },
    ];

    it('Should return not found when machine not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .post(
          `/groups/${group.groupId}/machines/${mockMachineId}/inspection-forms`,
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

    it('Should return BadRequestException when customInspectionItems contain at least 2 elements', async () => {
      await createRecord(connection, recordInsert);
      const input = {
        inspectionFormId: mockCustomInspectionFormId,
        inspectionFormType: InspectionFormType.CUSTOM,
        name: 'string',
        currentStatus: 'PUBLISHED',
        customInspectionItems: [
          {
            itemCode: 'string',
            name: 'string',
            description: 'string',
            resultType: 'OK_OR_ANOMARY',
            isImmutable: true,
            isForcedRequired: true,
            isRequired: true,
          },
        ],
      };

      return request(app.getHttpServer())
        .post(
          `/groups/${group.groupId}/machines/${machine.machineId}/inspection-forms`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.details.message[0]).toContain(
            'customInspectionItems must contain at least 2 elements',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Should return the inspectionFormId is valid', async () => {
      await createRecord(connection, recordInsert);
      const input = {
        inspectionFormId: mockCustomInspectionFormId,
        inspectionFormType: InspectionFormType.CUSTOM,
        name: 'string',
        currentStatus: 'PUBLISHED',
        customInspectionItems: [
          {
            itemCode: 'string',
            name: 'string',
            description: 'string',
            resultType: 'OK_OR_ANOMARY',
            isImmutable: true,
            isForcedRequired: true,
            isRequired: true,
          },
          {
            itemCode: 'string',
            name: 'string',
            description: 'string',
            resultType: 'OK_OR_ANOMARY',
            isImmutable: true,
            isForcedRequired: true,
            isRequired: true,
          },
        ],
      };

      return request(app.getHttpServer())
        .post(
          `/groups/${group.groupId}/machines/${machine.machineId}/inspection-forms`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'The inspectionFormId is invalid.',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Should return BadRequestException when currentStatus is not one of the following value: DRAFT, PUBLISHED', async () => {
      await createRecord(connection, recordInsert);
      const input = {
        inspectionFormId: mockCustomInspectionFormId,
        inspectionFormType: InspectionFormType.CUSTOM,
        name: 'string',
        currentStatus: 'DELETED',
        customInspectionItems: [
          {
            itemCode: 'string',
            name: 'string',
            description: 'string',
            resultType: 'OK_OR_ANOMARY',
            isImmutable: true,
            isForcedRequired: true,
            isRequired: true,
          },
          {
            itemCode: 'string',
            name: 'string',
            description: 'string',
            resultType: 'OK_OR_ANOMARY',
            isImmutable: true,
            isForcedRequired: true,
            isRequired: true,
          },
        ],
      };

      return request(app.getHttpServer())
        .post(
          `/groups/${group.groupId}/machines/${machine.machineId}/inspection-forms`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.details.message[0]).toContain(
            'currentStatus must be one of the following values:',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Should return create draft | public inspection form success', async () => {
      await createRecord(connection, recordInsert);
      const input = {
        inspectionFormId: customInspectionFormId,
        inspectionFormType: 'TEMPLATE',
        currentStatus: 'PUBLISHED',
        name: 'General',
        customInspectionItems: [
          {
            inspectionItemId: '01HK4QBQJDXRCZ1BD4T44MMGXJ',
            name: 'Visual check around the work equipment',
            description: 'description',
            itemCode: null,
            resultType: 'OK_OR_ANOMARY',
            isRequired: true,
            isImmutable: false,
            isForcedRequired: false,
          },
          {
            inspectionItemId: '01HK4QFQ1AEVDQYFPYE8HDTX40',
            name: 'Service meter/SMR (h)',
            description: '',
            itemCode: 'SERVICE_METER',
            resultType: 'NUMERIC',
            isRequired: true,
            isImmutable: true,
            isForcedRequired: true,
          },
        ],
      };

      return request(app.getHttpServer())
        .post(
          `/groups/${group.groupId}/machines/${machine.machineId}/inspection-forms`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('customInspectionFormId');
          expect(res.body.meta).toEqual({
            successMessage: 'Published successfully.',
            screenPermission: {
              allowEditDeleteGroup: false,
              allowCreateEditDeleteMachine: false,
              allowCreateEditDeleteMember: false,
              allowCreateEditDeleteInspectionForm: true,
              allowCreateInspectionAndReport: false,
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.CREATED);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'custom_inspection_item_histories',
        'custom_inspection_items',
        'custom_inspection_forms',
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

  describe('(PUT) /groups/:groupId/machines/:machineId/inspections/:inspectionId', () => {
    it('Should return not found when machine not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${mockMachineId}/inspections/${inspectionId}`,
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

    it('Should return not found when custom inspection form not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machineId}/inspections/${mockInspectionId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Inspection not found or not in this machine.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return BadRequestException when inspectionItem not found in inspectionForm.', async () => {
      await createRecord(connection, recordInsert);
      const input = {
        inspectionFormId: customInspectionForm.customInspectionFormId,
        lat: 0,
        lng: 0,
        locationAccuracy: 'string',
        devicePlatform: 'IOS',
        currentStatus: 'POSTED',
        inspectionItems: [
          {
            inspectionItemId: '01HNW047K269XNQ5T27P7FENVD',
            itemCode: null,
            result: 'OK',
            isRequired: true,
            resultType: 'OK_OR_ANOMARY',
            inspectionResultId: '01HNW0QQ9G0WKT1YFZ6AWXP39A',
            machineReport: null,
          },
          {
            inspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
            name: 'サービスメーター/SMR (h)',
            itemCode: 'SERVICE_METER',
            resultType: 'NUMERIC',
            isRequired: true,
            inspectionResultId: '01HNW0QQ9HSVSZNQZGZACC25RD',
            result: '10',
            machineReport: null,
          },
        ],
      };

      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machineId}/inspections/${inspectionId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'inspectionItem not found in inspectionForm.',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Should return BadRequestException when inspectionItem input not valid.', async () => {
      await createRecord(connection, recordInsert);
      await createRecord(connection, [
        {
          entity: CustomInspectionItem,
          data: {
            customInspectionItemId: ulid(),
            customInspectionFormId: customInspectionFormId,
            name: 'name',
            description: 'description',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            isImmutable: true,
            isForcedRequired: true,
            position: 1,
            currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
            lastStatusUpdatedAt: new Date(),
            itemCode: null,
          },
        },
      ]);
      const input = {
        inspectionFormId: customInspectionForm.customInspectionFormId,
        lat: 0,
        lng: 0,
        locationAccuracy: 'string',
        devicePlatform: 'IOS',
        currentStatus: 'POSTED',
        inspectionItems: [
          {
            inspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
            name: 'サービスメーター/SMR (h)',
            itemCode: 'SERVICE_METER',
            resultType: 'NUMERIC',
            isRequired: true,
            inspectionResultId: '01HNW0QQ9HSVSZNQZGZACC25RD',
            result: '10',
            machineReport: null,
          },
        ],
      };

      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machineId}/inspections/${inspectionId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'inspectionItem input not valid.',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Should return update inspection success', async () => {
      await createRecord(connection, recordInsert);
      await createRecord(connection, [
        {
          entity: CustomInspectionItem,
          data: [
            {
              customInspectionItemId: '01HNW047K269XNQ5T27P7FENVD',
              customInspectionFormId: customInspectionFormId,
              name: 'name',
              description: 'description',
              resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
              isRequired: true,
              isImmutable: true,
              isForcedRequired: true,
              position: 1,
              currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
              lastStatusUpdatedAt: new Date(),
              itemCode: null,
            },
            {
              customInspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
              customInspectionFormId: customInspectionFormId,
              name: 'name',
              description: 'description',
              resultType: CustomInspectionItemResultType.NUMERIC,
              isRequired: true,
              isImmutable: true,
              isForcedRequired: true,
              position: 2,
              currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
              lastStatusUpdatedAt: new Date(),
              itemCode: 'SERVICE_METER',
            },
          ],
        },
        {
          entity: InspectionResult,
          data: [
            {
              inspectionResultId: ulid(),
              result: 'OK',
              inspectionId: inspectionId,
              customInspectionItemId: '01HNW047K269XNQ5T27P7FENVD',
              currentStatus: 'POSTED',
              lastStatusUpdatedAt: new Date(),
              itemCode: null,
            },
            {
              inspectionResultId: ulid(),
              result: '123',
              inspectionId: inspectionId,
              customInspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
              currentStatus: 'POSTED',
              lastStatusUpdatedAt: new Date(),
              itemCode: 'SERVICE_METER',
            },
          ],
        },
      ]);
      const input = {
        inspectionFormId: customInspectionFormId,
        lat: 0,
        lng: 0,
        locationAccuracy: 'string',
        devicePlatform: 'IOS',
        currentStatus: 'POSTED',
        inspectionItems: [
          {
            inspectionItemId: '01HNW047K269XNQ5T27P7FENVD',
            name: 'name',
            itemCode: null,
            resultType: 'OK_OR_ANOMARY',
            isRequired: true,
            inspectionResultId: '01HNW0QQ9G0WKT1YFZ6AWXP39A',
            result: 'OK',
            machineReport: null,
          },
          {
            inspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
            name: 'サービスメーター/SMR (h)',
            itemCode: 'SERVICE_METER',
            resultType: 'NUMERIC',
            isRequired: true,
            inspectionResultId: '01HNW0QQ9HSVSZNQZGZACC25RD',
            result: '10',
            machineReport: null,
          },
        ],
      };

      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machineId}/inspections/${inspectionId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {},
            meta: {
              successMessage: 'Sent inspection result successfully.',
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateEditDeleteInspectionForm: true,
                allowCreateInspectionAndReport: true,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'inspection_result_histories',
        'inspection_results',
        'custom_inspection_items',
        'inspections',
        'custom_inspection_forms',
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

  describe('(GET) /groups/:groupId/machines/:machineId/user-inspection-form-drafts', () => {
    it('Should return not found when machine not found', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${mockMachineId}/user-inspection-form-drafts`,
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

    it('Should return get list user inspection form draft success', async () => {
      await createRecord(connection, recordInsert);

      await createRecord(connection, [
        {
          entity: CustomInspectionForm,
          data: {
            customInspectionFormId: 'INSPECTIONFORMW3R3R4TGT4D',
            name: 'inspection name',
            machineId: machineId,
            currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
            lastStatusUpdatedAt: '2024-04-25T03:05:00.000Z',
          },
        },
        {
          entity: CustomInspectionFormHistory,
          data: {
            customInspectionFormHistoryId: ulid(),
            eventType: EventType.CREATE,
            eventAt: '2024-04-25T03:05:00.000Z',
            actionedByUserId: user.userId,
            name: 'name',
            machineId: machineId,
            currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
            customInspectionFormId: 'INSPECTIONFORMW3R3R4TGT4D',
          },
        },
      ]);

      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${machineId}/user-inspection-form-drafts`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectResponse = [
            {
              customInspectionFormId: 'INSPECTIONFORMW3R3R4TGT4D ',
              name: 'inspection name',
              lastStatusUpdatedAt: '2024-04-25T03:05:00.000Z',
            },
          ];
          expect(res.body).toEqual({
            data: expectResponse,
            meta: {
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateEditDeleteInspectionForm: true,
                allowCreateInspectionAndReport: true,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'inspections',
        'custom_inspection_forms',
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

  describe('(GET) /groups/:groupId/machines/:machineId/inspection-form-templates/:inspectionFormTemplateId', () => {
    it('Should return not found when machine not found', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .get(
          `/groups/${group.groupId}/machines/${mockMachineId}/inspection-form-templates/${mockInspectionFormTemplateId}`,
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

    it('Should return not found when InspectionFormTemplate not found', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${machineId}/inspection-form-templates/${mockInspectionFormTemplateId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'InspectionFormTemplate not found.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return not found when get inspection form template detail success', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${machineId}/inspection-form-templates/${inspectionFormTemplateId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectResponse = {
            inspectionFormId: '01HK75F5HZFJ44679AV6H115CW',
            type: InspectionFormType.TEMPLATE,
            name: 'Inspection form common to all machine',
            inspectionItems: expect.any(Array),
          };
          expect(res.body.data).toEqual(
            expect.objectContaining(expectResponse),
          );
          expect(res.body.meta).toEqual({
            screenPermission: {
              allowEditDeleteGroup: false,
              allowCreateEditDeleteMachine: false,
              allowCreateEditDeleteMember: false,
              allowCreateEditDeleteInspectionForm: true,
              allowCreateInspectionAndReport: true,
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'inspections',
        'custom_inspection_forms',
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

  describe('(POST) /groups/:groupId/machines/:machineId/inspections', () => {
    it('Should return not found when machine not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .post(`/groups/${group.groupId}/machines/${mockMachineId}/inspections`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Machine not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return not found when machine not found', async () => {
      await createRecord(connection, recordInsert);
      const input = {
        inspectionFormId: ulid(),
        lat: 0,
        lng: 0,
        locationAccuracy: 'string',
        devicePlatform: 'IOS',
        currentStatus: 'POSTED',
        inspectionItems: [
          {
            inspectionItemId: '01HNW047K269XNQ5T27P7FENVD',
            name: 'name',
            itemCode: null,
            resultType: 'OK_OR_ANOMARY',
            isRequired: true,
            inspectionResultId: '01HNW0QQ9G0WKT1YFZ6AWXP39A',
            result: 'OK',
            machineReport: null,
          },
          {
            inspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
            name: 'サービスメーター/SMR (h)',
            itemCode: 'SERVICE_METER',
            resultType: 'NUMERIC',
            isRequired: true,
            inspectionResultId: '01HNW0QQ9HSVSZNQZGZACC25RD',
            result: '10',
            machineReport: null,
          },
        ],
      };

      return request(app.getHttpServer())
        .post(`/groups/${group.groupId}/machines/${machineId}/inspections`)
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Custom inspection form not found or not in this machine.',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Should return not found when custom inspection form not found or not in this machine.', async () => {
      await createRecord(connection, recordInsert);
      await createRecord(connection, [
        {
          entity: CustomInspectionForm,
          data: {
            customInspectionFormId: 'INSPECTIONFORMW3RQW4TEF3DE',
            name: 'inspection name',
            machineId: machineId,
            currentStatus: CustomInspectionFormCurrentStatus.DELETED,
            lastStatusUpdatedAt: '2024-04-25T03:05:00.000Z',
          },
        },
      ]);
      const input = {
        inspectionFormId: 'INSPECTIONFORMW3RQW4TEF3DE',
        lat: 0,
        lng: 0,
        locationAccuracy: 'string',
        devicePlatform: 'IOS',
        currentStatus: 'DRAFT',
        inspectionItems: [
          {
            inspectionItemId: '01HNW047K269XNQ5T27P7FENVD',
            name: 'name',
            itemCode: null,
            resultType: 'OK_OR_ANOMARY',
            isRequired: true,
            inspectionResultId: '01HNW0QQ9G0WKT1YFZ6AWXP39A',
            result: 'OK',
            machineReport: null,
          },
          {
            inspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
            name: 'サービスメーター/SMR (h)',
            itemCode: 'SERVICE_METER',
            resultType: 'NUMERIC',
            isRequired: true,
            inspectionResultId: '01HNW0QQ9HSVSZNQZGZACC25RD',
            result: '10',
            machineReport: null,
          },
        ],
      };

      return request(app.getHttpServer())
        .post(`/groups/${group.groupId}/machines/${machineId}/inspections`)
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'The custom inspection form has been deleted.',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Should return not found when create public/draft inspection success', async () => {
      await createRecord(connection, recordInsert);
      await createRecord(connection, [
        {
          entity: CustomInspectionItem,
          data: [
            {
              customInspectionItemId: '01HNW047K269XNQ5T27P7FENVD',
              customInspectionFormId: customInspectionFormId,
              name: 'name',
              description: 'description',
              resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
              isRequired: true,
              isImmutable: true,
              isForcedRequired: true,
              position: 1,
              currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
              lastStatusUpdatedAt: new Date(),
              itemCode: null,
            },
            {
              customInspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
              customInspectionFormId: customInspectionFormId,
              name: 'name',
              description: 'description',
              resultType: CustomInspectionItemResultType.NUMERIC,
              isRequired: true,
              isImmutable: true,
              isForcedRequired: true,
              position: 2,
              currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
              lastStatusUpdatedAt: new Date(),
              itemCode: 'SERVICE_METER',
            },
          ],
        },
      ]);
      const input = {
        inspectionFormId: customInspectionFormId,
        lat: 0,
        lng: 0,
        locationAccuracy: 'string',
        devicePlatform: 'IOS',
        currentStatus: 'POSTED',
        inspectionItems: [
          {
            inspectionItemId: '01HNW047K269XNQ5T27P7FENVD',
            name: 'name',
            itemCode: null,
            resultType: 'OK_OR_ANOMARY',
            isRequired: true,
            inspectionResultId: '01HNW0QQ9G0WKT1YFZ6AWXP39A',
            result: 'OK',
            machineReport: null,
          },
          {
            inspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
            name: 'サービスメーター/SMR (h)',
            itemCode: 'SERVICE_METER',
            resultType: 'NUMERIC',
            isRequired: true,
            inspectionResultId: '01HNW0QQ9HSVSZNQZGZACC25RD',
            result: '10',
            machineReport: null,
          },
        ],
      };

      return request(app.getHttpServer())
        .post(`/groups/${group.groupId}/machines/${machineId}/inspections`)
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {},
            meta: {
              successMessage: 'Sent inspection result successfully.',
              screenPermission: {
                allowCreateEditDeleteInspectionForm: true,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: true,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.CREATED);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'inspection_result_histories',
        'inspection_results',
        'custom_inspection_items',
        'inspections',
        'custom_inspection_forms',
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

  describe('(GET) /groups/:groupId/machines/:machineId/inspection-form-templates', () => {
    it('Should return not found when group not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-form-templates`,
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

    it('Should return not found when machine not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${group.groupId}/machines/${mockMachineId}/inspection-form-templates`,
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

    it('Should return inspection form templates success', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${machineId}/inspection-form-templates/`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectResponse = {
            customInspectionForms: [
              {
                customInspectionFormId:
                  customInspectionForm.customInspectionFormId,
                name: 'inspection name',
              },
            ],
            inspectionFormTemplates: [
              {
                inspectionFormTemplateId: '01HK75FPW6960DGWSMP1QQT7RD',
                inspectionFormTemplateName: 'Crawler excavator',
              },
              {
                inspectionFormTemplateId: '01HK75F5HZFJ44679AV6H115CW',
                inspectionFormTemplateName:
                  'Inspection form common to all machine',
              },
            ],
          };
          expect(res.body.data).toEqual(
            expect.objectContaining(expectResponse),
          );
          expect(res.body.meta).toEqual({
            screenPermission: {
              allowEditDeleteGroup: false,
              allowCreateEditDeleteMachine: false,
              allowCreateEditDeleteMember: false,
              allowCreateEditDeleteInspectionForm: true,
              allowCreateInspectionAndReport: true,
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'inspections',
        'custom_inspection_forms',
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

  describe('(PUT) /groups/:groupId/machines/:machineId/inspection-forms/:customInspectionFormId', () => {
    it('Should return not found when group not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspection-forms/${mockCustomInspectionFormId}`,
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

    it('Should return not found when machine not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${mockMachineId}/inspection-forms/${mockCustomInspectionFormId}`,
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

    it('Should return not found when custom inspection form template not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machineId}/inspection-forms/${mockCustomInspectionFormId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Custom inspection form not found or not in this machine.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return BadRequestException when name inspection wrong format.', async () => {
      await createRecord(connection, recordInsert);
      const input = {
        name: 2,
      };

      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machineId}/inspection-forms/${customInspectionFormId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.details.message[0]).toContain(
            'name must be a string',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Should return update custom inspection name success', async () => {
      await createRecord(connection, recordInsert);
      const input = {
        name: 'updateName',
      };

      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machineId}/inspection-forms/${customInspectionFormId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .send(input)
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {
              customInspectionFormId: customInspectionFormId,
            },
            meta: {
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateEditDeleteInspectionForm: true,
                allowCreateInspectionAndReport: true,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'inspection_result_histories',
        'inspection_results',
        'custom_inspection_items',
        'inspections',
        'custom_inspection_forms',
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

  it('Should return update custom inspection success', async () => {
    await createRecord(connection, recordInsert);
    const input = {
      inspectionFormId: '01HQ0D2PHJMYJ36R6SG5F512PQ',
      inspectionFormType: 'CUSTOM',
      name: 'inspection form test',
      currentStatus: 'DRAFT',
      lat: 999,
      lng: 324,
      locationAccuracy: 'test',
      devicePlatform: 'IOS',
      customInspectionItems: [
        {
          name: '12',
          description: '1212',
          resultType: 'NUMERIC',
          isImmutable: true,
          isForcedRequired: true,
        },
        {
          name: '12',
          description: '1212',
          resultType: 'NUMERIC',
          isImmutable: true,
          isForcedRequired: true,
        },
      ],
    };
    const customInspectionFormIdSecond = ulid();
    const customInspectionFormHistoryId = ulid();
    await createRecord(connection, [
      {
        entity: CustomInspectionForm,
        data: {
          customInspectionFormId: customInspectionFormIdSecond,
          name: 'inspection name 2',
          machineId: machine.machineId,
          currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
          lastStatusUpdatedAt: new Date(),
        },
      },
      {
        entity: CustomInspectionFormHistory,
        data: {
          customInspectionFormHistoryId,
          eventType: EventType.CREATE,
          eventAt: new Date(),
          actionedByUserId: user.userId,
          customInspectionFormId: customInspectionFormIdSecond,
          name: 'inspection name 2',
          machineId: machine.machineId,
          currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
        },
      },
      {
        entity: CustomInspectionItem,
        data: [
          {
            customInspectionFormId: customInspectionFormIdSecond,
            customInspectionItemId: '01HK4QBQJDXRCZ1BD4T44MDGXJ',
            name: 'Visual check around the work equipment',
            description: 'description',
            itemCode: null,
            resultType: 'OK_OR_ANOMARY',
            isRequired: true,
            isImmutable: false,
            isForcedRequired: false,
            currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
            lastStatusUpdatedAt: new Date(),
            position: 1,
          },
          {
            customInspectionFormId: customInspectionFormIdSecond,
            customInspectionItemId: '01HK4QFQ1AEVDQYFPYC8HDTX40',
            name: 'Service meter/SMR (h)',
            description: '',
            itemCode: 'SERVICE_METER',
            resultType: 'NUMERIC',
            isRequired: true,
            isImmutable: true,
            isForcedRequired: true,
            currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
            lastStatusUpdatedAt: new Date(),
            position: 2,
          },
        ],
      },
      {
        entity: CustomInspectionItemHistory,
        data: [
          {
            customInspectionItemHistoryId: ulid(),
            eventType: EventType.CREATE,
            eventAt: new Date(),
            actionedByUserId: user.userId,
            customInspectionFormHistoryId,
            customInspectionItemId: '01HK4QBQJDXRCZ1BD4T44MDGXJ',
            name: 'Visual check around the work equipment',
            description: 'description',
            itemCode: null,
            resultType: 'OK_OR_ANOMARY',
            isRequired: true,
            isImmutable: false,
            isForcedRequired: false,
            currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
            lastStatusUpdatedAt: new Date(),
            position: 1,
          },
          {
            customInspectionItemHistoryId: ulid(),
            eventType: EventType.CREATE,
            eventAt: new Date(),
            actionedByUserId: user.userId,
            customInspectionFormHistoryId,
            customInspectionItemId: '01HK4QFQ1AEVDQYFPYC8HDTX40',
            name: 'Service meter/SMR (h)',
            description: '',
            itemCode: 'SERVICE_METER',
            resultType: 'NUMERIC',
            isRequired: true,
            isImmutable: true,
            isForcedRequired: true,
            currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
            lastStatusUpdatedAt: new Date(),
            position: 2,
          },
        ],
      },
    ]);

    return request(app.getHttpServer())
      .put(
        `/groups/${groupId}/machines/${machineId}/inspection-forms/${customInspectionFormIdSecond}`,
      )
      .set('Authorization', 'Bearer invalid_token')
      .send(input)
      .set('x-lang', ISOLocaleCode.EN)
      .expect((res) => {
        expect(res.body).toEqual({
          data: {
            customInspectionFormId: customInspectionFormIdSecond,
          },
          meta: {
            screenPermission: {
              allowEditDeleteGroup: false,
              allowCreateEditDeleteMachine: false,
              allowCreateEditDeleteMember: false,
              allowCreateEditDeleteInspectionForm: true,
              allowCreateInspectionAndReport: true,
            },
          },
        });
        expect(res.statusCode).toEqual(HttpStatus.OK);
      });
  });

  afterEach(async () => {
    await clearDatabase(connection, [
      'custom_inspection_item_histories',
      'custom_inspection_form_histories',
      'custom_inspection_item_medias',
      'inspection_result_histories',
      'inspection_results',
      'custom_inspection_items',
      'inspections',
      'custom_inspection_forms',
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

  describe('(GET) /groups/:groupId/machines/:machineId/inspections/:inspectionId', () => {
    it('Should return not found when group not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${mockGroupId}/machines/${mockMachineId}/inspections/${inspectionId}`,
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

    it('Should return not found when machine not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${group.groupId}/machines/${mockMachineId}/inspections/${inspectionId}`,
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

    it('Should return not found when inspection not found', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(
          `/groups/${group.groupId}/machines/${machineId}/inspections/${mockInspectionId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Inspection not found or not in this machine.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Should return inspection detail success', async () => {
      const inspectionResultIdFirst = ulid();
      const inspectionResultIdSecond = ulid();
      await createRecord(connection, recordInsert);
      await createRecord(connection, [
        {
          entity: InspectionHistory,
          data: {
            inspectionHistoryId: ulid(),
            eventType: EventType.CREATE,
            actionedByUserId: user.userId,
            eventAt: new Date(),
            inspectionId,
            inspectionAt: new Date(),
            machineId: machine.machineId,
            lat: 10,
            lng: 10,
            locationAccuracy: 'string',
            devicePlatform: DevicePlatform.IOS,
            currentStatus: InspectionCurrentStatus.POSTED,
            lastStatusUpdatedAt: new Date(),
            customInspectionFormId: customInspectionForm.customInspectionFormId,
          },
        },
        {
          entity: CustomInspectionItem,
          data: [
            {
              customInspectionItemId: '01HNW047K269XNQ5T27P7FENVD',
              customInspectionFormId: customInspectionFormId,
              name: 'name',
              description: 'description',
              resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
              isRequired: true,
              isImmutable: true,
              isForcedRequired: true,
              position: 1,
              currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
              lastStatusUpdatedAt: new Date(),
              itemCode: null,
            },
            {
              customInspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
              customInspectionFormId: customInspectionFormId,
              name: 'name',
              description: 'description',
              resultType: CustomInspectionItemResultType.NUMERIC,
              isRequired: true,
              isImmutable: true,
              isForcedRequired: true,
              position: 2,
              currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
              lastStatusUpdatedAt: new Date(),
              itemCode: 'SERVICE_METER',
            },
          ],
        },
        {
          entity: InspectionResult,
          data: [
            {
              inspectionResultId: inspectionResultIdFirst,
              result: 'OK',
              inspectionId: inspectionId,
              customInspectionItemId: '01HNW047K269XNQ5T27P7FENVD',
              currentStatus: 'POSTED',
              lastStatusUpdatedAt: new Date(),
              itemCode: null,
            },
            {
              inspectionResultId: inspectionResultIdSecond,
              result: '123.0',
              inspectionId: inspectionId,
              customInspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
              currentStatus: 'POSTED',
              lastStatusUpdatedAt: new Date(),
              itemCode: 'SERVICE_METER',
            },
          ],
        },
      ]);
      return request(app.getHttpServer())
        .get(
          `/groups/${groupId}/machines/${machineId}/inspections/${inspectionId}`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectResponse = {
            currentStatus: 'POSTED',
            devicePlatform: 'IOS',
            givenName: 'givenName',
            inspectionFormId: customInspectionFormId,
            inspectionItems: [
              {
                description: 'description',
                inspectionId,
                inspectionItemId: '01HNW047K269XNQ5T27P7FENVD',
                inspectionItemMedias: [],
                inspectionResultId: inspectionResultIdFirst,
                isForcedRequired: true,
                isImmutable: true,
                isRequired: true,
                itemCode: null,
                machineReport: null,
                name: 'name',
                position: 1,
                result: 'OK',
                resultType: 'OK_OR_ANOMARY',
              },
              {
                description: 'description',
                inspectionId,
                inspectionItemId: '01HNW047K3ZSE0BGKM056MASN6',
                inspectionItemMedias: [],
                inspectionResultId: inspectionResultIdSecond,
                isForcedRequired: true,
                isImmutable: true,
                isRequired: true,
                itemCode: 'SERVICE_METER',
                machineReport: null,
                name: 'name',
                position: 2,
                result: '123.0',
                resultType: 'NUMERIC',
              },
            ],
            lastStatusUpdatedAt: inspection.lastStatusUpdatedAt.toISOString(),
            lat: 10,
            lng: 10,
            locationAccuracy: 'string',
            name: 'inspection name',
            odometer: null,
            pictureUrl: 'https://picsum.photos/id/1/200/200',
            serviceMeter: '123.0',
            surname: 'surname',
            type: 'INSPECTION',
            userId: user.userId,
          };
          expect(res.body.data).toEqual(
            expect.objectContaining(expectResponse),
          );
          expect(res.body.meta).toEqual({
            screenPermission: {
              allowEditDeleteGroup: false,
              allowCreateEditDeleteMachine: false,
              allowCreateEditDeleteMember: false,
              allowCreateEditDeleteInspectionForm: true,
              allowCreateInspectionAndReport: true,
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'inspection_result_histories',
        'inspection_results',
        'inspections',
        'custom_inspection_items',
        'custom_inspection_forms',
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

  afterAll(async () => {
    await clearDatabase(connection, [
      'custom_inspection_forms',
      'user_group_permission_assignments',
      'user_group_settings',
      'user_group_assignments',
      'user_ciam_links',
      'machine_reports',
      'machines',
      'users',
      'groups',
    ]);
    await app.close();
    await connection.destroy();
  });
});
