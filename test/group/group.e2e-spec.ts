import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { BlobStorageFileService } from '@blob-storage/services/blob-storage-file.service';
import { FirebaseService } from '@firebase/services/firebase.service';
import {
  DeleteGroupsInput,
  GroupCandidateUserOutput,
  GroupsUserArchiveStatusInput,
  UpdateGroupInput,
  UpdateGroupOutput,
} from '@group/dtos';
import { Group } from '@group/entities';
import {
  Machine,
  MachineCondition,
  MachineHistory,
  UserGroupMachineFavorite,
} from '@machine/entities';
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
  GroupCurrentStatus,
  ISOLocaleCode,
  Platform,
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
import { plainToInstance } from 'class-transformer';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { ulid } from 'ulid';

import typeOrmConfig from '../../ormconfig.test';
import { AppModule } from '../../src/app.module';
import {
  group,
  groupSecond,
  machine,
  mockGroupDeleted,
  mockGroupId,
  mockGroupMachineCondition,
  mockMachine,
  mockUserGroupMachineFavorite,
  user,
  userCiam,
  userGroupAssignment,
  userGroupPermissionAssignment,
  userGroupPermissionAssignmentMachine,
  userGroupPermissionAssignmentUser,
  userGroupSetting,
  userSecond,
  userSecondCiam,
  userSecondGroupAssignment,
} from '../mock/data.mock';
import { mockAuthGuard } from '../mock/guard.mock';
import {
  clearDatabase,
  createMockGroup,
  createMockUser,
  createRecord,
  TableRecord,
} from '../test-utils';

describe('GroupController (e2e): Unauthorized', () => {
  let app: INestApplication;
  const groupId = group.groupId;
  const userId = user.userId;
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

  describe('(GET) /groups/:groupId/users', () => {
    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /groups', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get('/groups')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get('/groups')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(POST) /groups/:groupId/users/invitations', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .post(`/groups/${mockGroupId}/users/invitations`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .post(`/groups/${mockGroupId}/users/invitations`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(POST) groups', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .post('/groups')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .post('/groups')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) groups/:groupId/candidate-users', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${mockGroupId}/candidate-users`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${mockGroupId}/candidate-users`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /groups/:groupId', () => {
    const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(DELETE) groups', () => {
    const mockInput: DeleteGroupsInput = {
      groupIds: ['065D212J34D8MAJ2SZZHN32ZB0'],
    };
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .delete('/groups')
        .send(mockInput)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .delete('/groups')
        .send(mockInput)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /groups/:groupId/permissions', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/permissions`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/permissions`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /groups/archive-status', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .put('/groups/archive-status')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .put('/groups/archive-status')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /groups/:groupId', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /groups/:groupId/available-machines', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/available-machines`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/available-machines`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(DELETE) :groupId/machines/:machineId', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines/${machine.machineId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines/${machine.machineId}`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(DELETE) /groups/:groupId/users/:userId/user-assignment-info', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .delete(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .delete(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /groups/:groupId/users/:userId/user-assignment-info', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
  describe('(GET) /groups/:groupId/machines', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(POST) /groups/:groupId/machines', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /groups/:groupId/users/:userId/user-assignment-info', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /groups/:groupId/machines/:machineId/favorites', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machine.machineId}/favorites`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machine.machineId}/favorites`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /groups/:groupId/machines/:machineId', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machine.machineId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machine.machineId}`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(POST) :groupId/machines/group-machine-assignments', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines/group-machine-assignments`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines/group-machine-assignments`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) :groupId/machines/:machineId', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines/${machine.machineId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines/${machine.machineId}`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) :groupId/machines/:machineId/machine-conditions', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machine.machineId}/machine-conditions`,
        )
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machine.machineId}/machine-conditions`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('GroupController (e2e)', () => {
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
    const mockedBlobStorageService = {
      getFileContent: jest.fn(() =>
        JSON.stringify({
          serialNumber: [
            {
              __comment__:
                'In case of updating komatsu manufacturer, and other machine type `OTHER`',
              type: 'KOMATSU_AND_DIFFERENT_OTHER_TYPE',
              manufacturer: '0661ATBN7XH5EB1NXCFDF4ZTMG',
              machineType: 'OTHER_MACHINE_TYPES',
              __regexComment__:
                '[0-9]+: Number OR (A|B|C|N|J|K|H|F|Y|NL)[0-9]+: Starting by A|B|C|N|J|K|H|F|Y|NL + number OR (DB|DZ)[a-zA-Z0-9]+: Starting by DB|DZ + number and character',
              regex:
                '^(([0-9]+)|((A|B|C|N|J|K|H|F|Y|NL)[0-9]+)|((DB|DZ)[a-zA-Z0-9]+))$',
              message: {
                ja: '機番の形式が不正です。',
                'en-US': 'The format of the serial number is invalid.',
              },
              maxLength: 8,
              uppercase: true,
            },
            {
              __comment__:
                'In the case of updating the manufacturer is komatsu, and the machine type is `OTHER`',
              type: 'KOMATSU_AND_OTHER_TYPE',
              manufacturer: '0661ATBN7XH5EB1NXCFDF4ZTMG',
              machineType: '0661J7JX6ZDP4HXM46349GPFHW',
              __regexComment__:
                'Character type: half-width alphabet (include number)',
              regex: '^[a-zA-Z0-9]+$',
              message: {
                ja: '半角英数字で入力してください。',
                'en-US':
                  'Please enter only half-width alphanumeric characters.',
              },
              maxLength: 10,
              uppercase: true,
            },
            {
              __comment__: 'In case update for other manufacturers',
              type: 'DIFFERENT_KOMATSU_AND_ALL_TYPE',
              manufacturer: 'OTHER_MACHINE_MANUFACTURERS',
              machineType: 'ALL_MACHINE_TYPES',
              __regexComment__:
                'Character type: half-width alphabet (include number)',
              regex: '^[a-zA-Z0-9]+$',
              message: {
                ja: '使用できない文字が入力されています。',
                'en-US': 'Please use valid characters only.',
              },
              maxLength: 20,
              uppercase: false,
            },
          ],
        }),
      ),
    };
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })

      .overrideProvider(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideProvider(BlobStorageService)
      .useValue({ generateSasUrl: (image: string) => image })
      .overrideProvider(BlobStorageFileService)
      .useValue(mockedBlobStorageService)
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

  const { groupId } = group;
  const { userId } = user;

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
      entity: User,
      data: userSecond,
    },
    {
      entity: UserCiamLink,
      data: userSecondCiam,
    },
    {
      entity: UserGroupPermissionAssignment,
      data: userGroupPermissionAssignmentUser,
    },
    {
      entity: UserGroupAssignment,
      data: userSecondGroupAssignment,
    },
  ];

  describe('(GET) /groups/:groupId/users', () => {
    it('EN: Get users in group: Group not found', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Get users in group: Group not found', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('EN: Get users in group: User not exist', async () => {
      await createRecord(connection, recordInsert.slice(0, 1));
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'Authentication failed. Please log in again.',
          );
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    it('JA: Get users in group: User not exist', async () => {
      await createRecord(connection, recordInsert.slice(0, 1));
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '認証に失敗しました。再度ログインしてください。',
          );
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    it('Get users in group: success', async () => {
      await clearDatabase(connection, [
        'groups',
        'users',
        'user_ciam_links',
        'user_group_assignments',
      ]);
      await createRecord(connection, recordInsert.slice(0, 4));
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectedOutput = [
            {
              ...user,
              searchId: res.body.data[0].searchId,
              registeredAt: res.body.data[0].registeredAt,
              lastStatusUpdatedAt: res.body.data[0].lastStatusUpdatedAt,
              userGroupAssignment: {
                userId: user.userId,
                groupId,
                lastStatusUpdatedAt: res.body.data[0].lastStatusUpdatedAt,
                currentStatus: userGroupAssignment.currentStatus,
                userGroupRoleName: userGroupAssignment.userGroupRoleName,
              },
            },
          ];
          expect(res.body).toEqual({
            data: expectedOutput,
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: false,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_ciam_links',
        'users',
        'groups',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(GET) /groups', () => {
    it('EN: Get groups: User not exist', async () => {
      await clearDatabase(connection, [
        'groups',
        'users',
        'user_ciam_links',
        'user_group_assignments',
      ]);
      await createRecord(connection, recordInsert.slice(0, 1));
      return request(app.getHttpServer())
        .get('/groups')
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'Authentication failed. Please log in again.',
          );
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    it('JA: Get groups: User not exist', async () => {
      return request(app.getHttpServer())
        .get('/groups')
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '認証に失敗しました。再度ログインしてください。',
          );
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    it('Get list group success"', async () => {
      await createRecord(connection, recordInsert.slice(0, 6));
      return request(app.getHttpServer())
        .get('/groups')
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectedOutput = {
            unarchivedGroups: [
              {
                ...group,
                isArchived: false,
                lastStatusUpdatedAt:
                  res.body.data.unarchivedGroups[0].lastStatusUpdatedAt,
                machineAssignmentCount: 0,
                userAssignmentCount: 1,
                allowEditDeleteGroup: false,
              },
            ],
            archivedGroups: [],
          };
          expect(res.body).toEqual({ data: expectedOutput, meta: {} });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });
  });

  describe('(POST) /groups/:groupId/users/invitations', () => {
    beforeEach(async () => {
      await clearDatabase(connection, [
        'user_ciam_links',
        'group_invitations',
        'user_group_assignments',
        'users',
        'groups',
      ]);
      await createMockUser(connection);
    });

    it('NotFoundException: User group id not exist. with x-lang: ja', async () => {
      const input = {
        inviteeUserId: 'USERC8KR9DYH6WB1N6G6AFVBFC',
        userGroupRoleName: 'RoleName',
        isAdmin: false,
        permissionIds: ['PERMISSION3H2ZBB5RA7334MC4'],
      };

      return request(app.getHttpServer())
        .post(`/groups/${mockGroupId}/users/invitations`)
        .send(input)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toEqual(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
        })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Forbidden: user have not permission in group.', async () => {
      const input = {
        inviteeUserId: 'invalid format',
        userGroupRoleName: 'RoleName',
        isAdmin: false,
        permissionIds: ['PERMISSION3H2ZBB5RA7334MC4'],
      };

      await createRecord(connection, [
        {
          entity: Group,
          data: {
            groupId: mockGroupId,
            groupName: 'groupName',
            location: 'location',
            currentStatus: GroupCurrentStatus.CREATED,
            lastStatusUpdatedAt: new Date(),
            companyName: 'company name',
          },
        },
      ]);

      return request(app.getHttpServer())
        .post(`/groups/${mockGroupId}/users/invitations`)
        .send(input)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toEqual(
            'You do not have access authority.',
          );
        })
        .expect(HttpStatus.FORBIDDEN);
    });

    it('BadRequestException: inviteeUserId is wrong format. with x-lang: JA', async () => {
      const input = {
        inviteeUserId: 'invalid format',
        userGroupRoleName: 'RoleName',
        isAdmin: false,
        permissionIds: ['PERMISSION3H2ZBB5RA7334MC4'],
        userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
      };

      await createMockGroup(connection);

      return request(app.getHttpServer())
        .post(`/groups/${mockGroupId}/users/invitations`)
        .send(input)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toEqual(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('BadRequestException: permissionIds is wrong format. with x-lang: en-US', async () => {
      const input = {
        inviteeUserId: 'USERC8KR9DYH6WB1N6G6AFVBFC',
        userGroupRoleName: 'RoleName',
        isAdmin: false,
        permissionIds: ['invalid format'],
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(input)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toEqual(
            'An unexpected error has occurred. Please try again later.',
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Invite user to group success', async () => {
      const input = {
        inviteeUserId: 'USERC8KR9DYH6WB1N6G6AFVBFC',
        userGroupRoleName: 'RoleName',
        isAdmin: false,
        permissionIds: [],
        userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
      };

      await createRecord(connection, [
        {
          entity: User,
          data: {
            userId: 'USERC8KR9DYH6WB1N6G6AFVBFC',
            searchId: '000000002',
            givenName: 'givenName',
            surname: 'surname',
            pictureUrl: 'pictureUrl',
            email: 'invitee@example.com',
            isSearchableByEmail: true,
            registeredAt: new Date(),
            isoLocaleCode: ISOLocaleCode.JA,
            residenceCountryCode: 'JA',
            dateOfBirth: '2023',
            currentStatus: UserCurrentStatus.CREATED,
            lastStatusUpdatedAt: new Date(),
          },
        },
        {
          entity: UserCiamLink,
          data: {
            userCiamLinkId: 'USERCIAMLINKH6WB1N6G6AFVBD',
            userId: 'USERC8KR9DYH6WB1N6G6AFVBFC',
            oid: 'example_oid2',
            iss: 'https://exampleiss.com/oid2',
            linkedAt: new Date(),
          },
        },
      ]);

      await createMockGroup(connection);

      return request(app.getHttpServer())
        .post(`/groups/${mockGroupId}/users/invitations`)
        .send(input)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.data.inviterUserId).toEqual(
            'USERC8KR9DYH6WB1N6G6AFVBFD',
          );
          expect(res.body.data.userGroupRoleName).toEqual('RoleName');
          expect(res.body.data.invitationResponse).toEqual('ACCEPTED');
          expect(res.body.meta.successMessage).toEqual('Added successfully.');
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('(POST) groups', () => {
    beforeEach(async () => {
      await clearDatabase(connection, [
        'user_ciam_links',
        'group_invitations',
        'user_group_assignments',
        'users',
        'groups',
      ]);
    });

    const timeNow = new Date();
    const user = {
      userId: ulid(),
      givenName: 'givenName',
      surname: 'surname',
      pictureUrl: 'https://picsum.photos/id/1/200/200',
      email: 'default-admin@example.com',
      isSearchableByEmail: true,
      registeredAt: timeNow,
      isoLocaleCode: ISOLocaleCode.JA,
      residenceCountryCode: 'JA',
      dateOfBirth: timeNow,
      currentStatus: UserCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      searchId: '000000123',
    };

    const userCiam = {
      userCiamLinkId: ulid(),
      userId: user.userId,
      oid: 'example_oid',
      iss: 'https://exampleiss.com/oid',
      linkedAt: timeNow,
    };

    const recordInsert: TableRecord[] = [
      {
        entity: User,
        data: user,
      },
      {
        entity: UserCiamLink,
        data: userCiam,
      },
    ];

    it('POST create group success', async () => {
      await createRecord(connection, recordInsert);
      const input = {
        groupName: 'mock group name',
        companyName: 'company name',
      };

      const expectedOutput = {
        ...input,
        groupId: undefined,
        currentStatus: undefined,
        lastStatusUpdatedAt: undefined,
      };

      return request(app.getHttpServer())
        .post('/groups')
        .send(input)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const response = res.body.data;
          expectedOutput.groupId = response.groupId;
          expectedOutput.currentStatus = response.currentStatus;
          expectedOutput.lastStatusUpdatedAt = response.lastStatusUpdatedAt;
          expect(res.body).toEqual({
            data: { ...expectedOutput },
            meta: { successMessage: 'Added successfully.' },
          });
          expect(res.statusCode).toEqual(HttpStatus.CREATED);
        });
    });

    it('POST create group fail when groupName wrong format', async () => {
      await createRecord(connection, recordInsert);
      const input = {
        groupName: 'mock group name ﾛ',
      };

      return request(app.getHttpServer())
        .post('/groups')
        .send(input)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toEqual(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });
  });

  describe('(GET) groups/:groupId/candidate-users', () => {
    const timeNow = new Date();
    const group = {
      groupId: ulid(),
      groupName: 'group name',
      location: 'location',
      currentStatus: GroupCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      companyName: 'company name',
    };

    const inviter = {
      userId: ulid(),
      givenName: 'givenName',
      surname: 'surname',
      pictureUrl: 'https://picsum.photos/id/1/200/200',
      email: 'default-admin@example.com',
      isSearchableByEmail: true,
      registeredAt: timeNow,
      isoLocaleCode: ISOLocaleCode.JA,
      residenceCountryCode: 'JA',
      dateOfBirth: timeNow,
      currentStatus: UserCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      searchId: '000000123',
    };

    const candidateUser = {
      userId: ulid(),
      givenName: 'candidate givenName',
      surname: ' candidate surname',
      pictureUrl: 'https://picsumm.photos/id/1/200/200',
      email: 'candidate-user@example.com',
      isSearchableByEmail: true,
      registeredAt: timeNow,
      isoLocaleCode: ISOLocaleCode.JA,
      residenceCountryCode: 'JA',
      dateOfBirth: timeNow,
      currentStatus: UserCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      searchId: '000000124',
    };

    const userCiam = {
      userCiamLinkId: ulid(),
      userId: inviter.userId,
      oid: 'example_oid',
      iss: 'https://exampleiss.com/oid',
      linkedAt: timeNow,
    };

    const userGroupAssignment = {
      userId: inviter.userId,
      groupId: group.groupId,
      lastStatusUpdatedAt: timeNow,
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      userGroupRoleName: 'mock role name',
      userGroupRoleTemplateId: '065D0EV3Q686CMBSQCDKR1FACC',
    };

    const userGroupPermissionAssignment = {
      userId: inviter.userId,
      groupId: group.groupId,
      permissionId: '065BDR92ZNGHX3R18CANF69Z00',
      assignedAt: timeNow,
    };

    const recordInsert: TableRecord[] = [
      {
        entity: Group,
        data: group,
      },
      {
        entity: User,
        data: inviter,
      },
      {
        entity: User,
        data: candidateUser,
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
    ];

    it('GET list candidate user success', async () => {
      await clearDatabase(connection, [
        'user_ciam_links',
        'users',
        'groups',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .get(
          `/groups/${group.groupId}/candidate-users?search=${candidateUser.searchId}`,
        )
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: [
              plainToInstance(
                GroupCandidateUserOutput,
                { ...candidateUser, isAlreadyInGroup: false },
                {
                  excludeExtraneousValues: true,
                },
              ),
            ],
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
                allowCreateInspectionAndReport: false,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });
  });

  describe('(PUT) /groups/:groupId', () => {
    const timeNow = new Date();
    const group = {
      groupId: ulid(),
      groupName: 'group name',
      location: 'location',
      currentStatus: GroupCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      companyName: 'company name',
    };

    const user = {
      userId: ulid(),
      givenName: 'givenName',
      surname: 'surname',
      pictureUrl: 'https://picsum.photos/id/1/200/200',
      email: 'default-admin@example.com',
      isSearchableByEmail: true,
      registeredAt: timeNow,
      isoLocaleCode: ISOLocaleCode.JA,
      residenceCountryCode: 'JA',
      dateOfBirth: timeNow,
      currentStatus: UserCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      searchId: '000000123',
    };

    const userCiam = {
      userCiamLinkId: ulid(),
      userId: user.userId,
      oid: 'example_oid',
      iss: 'https://exampleiss.com/oid',
      linkedAt: timeNow,
    };

    const userGroupAssignment = {
      userId: user.userId,
      groupId: group.groupId,
      lastStatusUpdatedAt: timeNow,
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      userGroupRoleName: 'mock role name',
      userGroupRoleTemplateId: '065D0EV3Q686CMBSQCDKR1FACC',
    };

    const userGroupPermissionAssignment = {
      permissionId: '065BDR92ZSK8KXMJZBQKKS9YFX',
      userId: user.userId,
      groupId: group.groupId,
      assignedAt: timeNow,
    };

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
    ];

    it('Update group: success"', async () => {
      await clearDatabase(connection, [
        'groups',
        'users',
        'user_ciam_links',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
      await createRecord(connection, recordInsert);
      const mockUpdateGroupInput: UpdateGroupInput = {
        groupName: 'mock group name',
        location: 'mock location',
        companyName: 'company name',
        allowNonKomatsuInfoUse: false,
      };
      const mockUpdateGroupOutput: UpdateGroupOutput = {
        groupId: group.groupId,
        groupName: 'mock group name',
        location: 'mock location',
        currentStatus: 'UPDATED',
        lastStatusUpdatedAt: new Date(),
        companyName: 'company name',
        allowNonKomatsuInfoUse: false,
      };

      return request(app.getHttpServer())
        .put(`/groups/${group.groupId}`)
        .send(mockUpdateGroupInput)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.data.groupId).toEqual(group.groupId);
          expect(res.body.data.groupName).toEqual(
            mockUpdateGroupOutput.groupName,
          );
          expect(res.body.data.location).toEqual(
            mockUpdateGroupOutput.location,
          );
          expect(res.body.data.currentStatus).toEqual(
            mockUpdateGroupOutput.currentStatus,
          );
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });
  });

  describe('(DELETE) groups', () => {
    const timeNow = new Date();
    const group = {
      groupId: ulid(),
      groupName: 'group name',
      location: 'location',
      currentStatus: GroupCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      companyName: 'company name',
    };

    const groupAlreadyDeleted = {
      groupId: ulid(),
      groupName: 'group name deleted',
      location: 'location',
      currentStatus: GroupCurrentStatus.DELETED,
      lastStatusUpdatedAt: timeNow,
      companyName: 'company name',
    };

    const user = {
      userId: ulid(),
      givenName: 'givenName',
      surname: 'surname',
      pictureUrl: 'https://picsum.photos/id/1/200/200',
      email: 'default-admin@example.com',
      isSearchableByEmail: true,
      registeredAt: timeNow,
      isoLocaleCode: ISOLocaleCode.JA,
      residenceCountryCode: 'JA',
      dateOfBirth: timeNow,
      currentStatus: UserCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      searchId: '000000123',
    };

    const userCiam = {
      userCiamLinkId: ulid(),
      userId: user.userId,
      oid: 'example_oid',
      iss: 'https://exampleiss.com/oid',
      linkedAt: timeNow,
    };

    const userGroupAssignment = {
      userId: user.userId,
      groupId: group.groupId,
      lastStatusUpdatedAt: timeNow,
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      userGroupRoleName: 'mock role name',
      userGroupRoleTemplateId: '065D0EV3Q686CMBSQCDKR1FACC',
    };

    const userGroupPermissionAssignment = {
      permissionId: '065BDR92ZSK8KXMJZBQKKS9YFX',
      userId: user.userId,
      groupId: group.groupId,
      assignedAt: timeNow,
    };

    const recordInsert: TableRecord[] = [
      {
        entity: Group,
        data: group,
      },
      {
        entity: Group,
        data: groupAlreadyDeleted,
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
    ];

    it('DELETE groups success', async () => {
      await clearDatabase(connection, ['user_ciam_links', 'users', 'groups']);
      await createRecord(connection, recordInsert);
      const mockInput: DeleteGroupsInput = {
        groupIds: [group.groupId],
      };
      return request(app.getHttpServer())
        .delete('/groups')
        .send(mockInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {},
            meta: { successMessage: 'Deleted successfully.' },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('DELETE should return bad request when group already deleted', async () => {
      await clearDatabase(connection, ['user_ciam_links', 'users', 'groups']);
      await createRecord(connection, recordInsert);
      const mockInput: DeleteGroupsInput = {
        groupIds: [groupAlreadyDeleted.groupId],
      };
      return request(app.getHttpServer())
        .delete('/groups')
        .send(mockInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toEqual('Already deleted.');
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });
  });

  describe('(GET) /groups/:groupId/permissions', () => {
    it('EN: Get user permission in group: Group not found', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/permissions`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Get user permission in group: Group not found', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/permissions`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('EN: Get user permission in group: User not exist', async () => {
      await createRecord(connection, recordInsert.slice(0, 1));
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/permissions`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'Authentication failed. Please log in again.',
          );
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    it('JA: Get user permission in group: User not exist', async () => {
      await createRecord(connection, recordInsert.slice(0, 1));
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/permissions`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '認証に失敗しました。再度ログインしてください。',
          );
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    it('JA: Get user permission in group: not have permission to access this group', async () => {
      await createRecord(connection, recordInsert.slice(0, 3));
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/permissions`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'アクセス権限がありません。',
          );
          expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
        });
    });

    it('Get user permission in group: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/permissions`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectedOutput = {
            exp: res.body.data.exp,
            groupId: group.groupId,
            permissions: {
              INSPECTIONS_AND_MACHINE_REPORTS: 'READ_CREATE',
              CUSTOM_INSPECTION_FORMS: 'READ_CREATE_UPDATE',
              USER_GROUP_ASSIGNMENTS: 'READ_CREATE_UPDATE_DELETE',
            },
            userId: user.userId,
          };
          expect(res.body).toEqual({
            data: expectedOutput,
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: true,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
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
        'user_ciam_links',
        'users',
        'groups',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(PUT) /groups/archive-status', () => {
    it('Update archive status groups: success"', async () => {
      await createRecord(connection, recordInsert);
      const mockGroupsUserArchiveStatusInput: GroupsUserArchiveStatusInput = {
        groupIds: [group.groupId],
        isArchived: true,
      };

      return request(app.getHttpServer())
        .put('/groups/archive-status')
        .send(mockGroupsUserArchiveStatusInput)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {},
            meta: { successMessage: 'グループをアーカイブしました。' },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Update archive status groups error: groupIds contain invalid groupId"', async () => {
      await createRecord(connection, recordInsert.slice(1, 3));
      const mockGroupsUserArchiveStatusInput: GroupsUserArchiveStatusInput = {
        groupIds: [group.groupId],
        isArchived: true,
      };

      return request(app.getHttpServer())
        .put('/groups/archive-status')
        .send(mockGroupsUserArchiveStatusInput)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Update archive status groups error: group exist deleted"', async () => {
      await createRecord(connection, recordInsert);
      await createRecord(connection, [
        {
          entity: Group,
          data: mockGroupDeleted,
        },
      ]);
      const mockGroupsUserArchiveStatusInput: GroupsUserArchiveStatusInput = {
        groupIds: [group.groupId, mockGroupDeleted.groupId],
        isArchived: true,
      };

      return request(app.getHttpServer())
        .put('/groups/archive-status')
        .send(mockGroupsUserArchiveStatusInput)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain('Already deleted.');
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Update archive status groups error: User have not permissions in this group"', async () => {
      await createRecord(connection, recordInsert.slice(0, 3));
      await createRecord(connection, recordInsert.slice(4, 7));
      const mockGroupsUserArchiveStatusInput: GroupsUserArchiveStatusInput = {
        groupIds: [group.groupId],
        isArchived: true,
      };

      return request(app.getHttpServer())
        .put('/groups/archive-status')
        .send(mockGroupsUserArchiveStatusInput)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'アクセス権限がありません。',
          );
          expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_ciam_links',
        'users',
        'groups',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(GET) /groups/:groupId', () => {
    it('Should return group detail info"', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .get(`/groups/${groupId}`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {
              ...group,
              lastStatusUpdatedAt: res.body.data.lastStatusUpdatedAt,
              isArchived: false,
              allowNonKomatsuInfoUse: false,
            },
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: true,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
                allowCreateInspectionAndReport: true,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Should return group detail info for web app"', async () => {
      await createRecord(connection, recordInsert);
      const memberCount = await UserGroupAssignment.countBy({ groupId });

      return request(app.getHttpServer())
        .get(`/groups/${groupId}`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .set('platform', Platform.WEBAPP)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {
              groupId: group.groupId,
              groupName: group.groupName,
              companyName: group.companyName,
              location: group.location,
              machineCount: 0,
              inspectionFormCount: 0,
              reportCount: 0,
              memberCount: memberCount,
              allowNonKomatsuInfoUse: false,
              currentStatus: 'CREATED',
              lastStatusUpdatedAt: res.body.data.lastStatusUpdatedAt,
            },
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: true,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
                allowCreateInspectionAndReport: true,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Should return error when handle an invalid group Id', async () => {
      return request(app.getHttpServer())
        .get('/groups/invalidGroup')
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_ciam_links',
        'users',
        'groups',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(GET) /groups/:groupId/available-machines', () => {
    const timeNow = new Date();
    const group = [
      {
        groupId: ulid(),
        groupName: 'group A',
        location: 'location',
        currentStatus: GroupCurrentStatus.CREATED,
        lastStatusUpdatedAt: timeNow,
        companyName: 'company name',
      },
      {
        groupId: ulid(),
        groupName: 'group B',
        location: 'location',
        currentStatus: GroupCurrentStatus.CREATED,
        lastStatusUpdatedAt: timeNow,
        companyName: 'company name',
      },
    ];

    const user = {
      userId: ulid(),
      givenName: 'given name',
      surname: 'surname',
      pictureUrl: 'https://picsum.photos/id/1/200/200',
      email: 'default-user@example.com',
      isSearchableByEmail: true,
      registeredAt: timeNow,
      isoLocaleCode: ISOLocaleCode.JA,
      residenceCountryCode: 'JA',
      dateOfBirth: timeNow,
      currentStatus: UserCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      searchId: '000000123',
    };

    const userCiam = {
      userCiamLinkId: ulid(),
      userId: user.userId,
      oid: 'example_oid',
      iss: 'https://exampleiss.com/oid',
      linkedAt: timeNow,
    };

    const userGroupAssignment = {
      userId: user.userId,
      groupId: group[0].groupId,
      lastStatusUpdatedAt: timeNow,
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      userGroupRoleName: 'mock role name',
      userGroupRoleTemplateId: '065D0EV3Q686CMBSQCDKR1FACC',
    };

    const userGroupPermissionAssignment = {
      permissionId: '065BDR8DCB6M7H3E25336KH3ZC',
      userId: user.userId,
      groupId: group[0].groupId,
      assignedAt: timeNow,
    };

    const machine = {
      machineId: ulid(),
      machineName: 'machine name',
      pictureUrl: 'string',
      modelAndType: 'DFSEFRE',
      serialNumber: 'serial number',
      serialNumberPlatePictureUrl: '',
      currentStatus: 'CREATED',
      lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
      machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
      machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
      groupId: group[1].groupId,
    };

    const machineHistory = {
      machineHistoryId: ulid(),
      eventType: 'CREATE',
      machineName: 'machine name',
      eventAt: '2024-01-16T02:00:30.000Z',
      actionedByUserId: user.userId,
      machineId: machine.machineId,
      serialNumberPlatePictureUrl: '',
      machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
      machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
      modelAndType: 'DFSEFRE',
      serialNumber: 'serial number',
      groupId: group[1].groupId,
      pictureUrl: 'string',
      currentStatus: 'CREATED',
    };

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
        entity: Machine,
        data: machine,
      },
      {
        entity: MachineHistory,
        data: machineHistory,
      },
    ];

    it('GET should return list suggestion with search machine', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .get(`/groups/${group[0].groupId}/available-machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .query({ search: 'machine' })
        .expect((res) => {
          const expectedOutput = [
            {
              machineId: machine.machineId,
              machineName: 'machine name',
              pictureUrl: 'string',
              modelAndType: 'DFSEFRE',
              isAlreadyInGroup: false,
              machineManufacturerName: 'KOMATSU',
            },
          ];

          expect(res.body).toEqual({
            data: expectedOutput,
            meta: {
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: true,
                allowCreateEditDeleteMember: false,
                allowCreateEditDeleteInspectionForm: false,
                allowCreateInspectionAndReport: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('GET should return list suggestion', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .get(`/groups/${group[0].groupId}/available-machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          const expectedOutput = [
            {
              machineId: machine.machineId,
              machineName: 'machine name',
              pictureUrl: 'string',
              modelAndType: 'DFSEFRE',
              isAlreadyInGroup: false,
              machineManufacturerName: 'KOMATSU',
            },
          ];

          expect(res.body).toEqual({
            data: expectedOutput,
            meta: {
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: true,
                allowCreateEditDeleteMember: false,
                allowCreateEditDeleteInspectionForm: false,
                allowCreateInspectionAndReport: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Update archive status groups error: User have not permissions in this group"', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .get(`/groups/${group[1].groupId}/available-machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'アクセス権限がありません。',
          );
          expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'machine_histories',
        'machines',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(DELETE) :groupId/machines/:machineId', () => {
    const timeNow = new Date();
    const user = {
      userId: ulid(),
      givenName: 'given name',
      surname: 'surname',
      pictureUrl: 'https://picsum.photos/id/1/200/200',
      email: 'default-user@example.com',
      isSearchableByEmail: true,
      registeredAt: timeNow,
      isoLocaleCode: ISOLocaleCode.JA,
      residenceCountryCode: 'JA',
      dateOfBirth: timeNow,
      currentStatus: UserCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      searchId: '000000123',
    };

    const userCiam = {
      userCiamLinkId: ulid(),
      userId: user.userId,
      oid: 'example_oid',
      iss: 'https://exampleiss.com/oid',
      linkedAt: timeNow,
    };

    const group = {
      groupId: ulid(),
      groupName: 'group A',
      location: 'location',
      currentStatus: GroupCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      companyName: 'company name',
    };

    const userGroupAssignment = {
      userId: user.userId,
      groupId: group.groupId,
      lastStatusUpdatedAt: timeNow,
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      userGroupRoleName: 'mock role name',
      userGroupRoleTemplateId: '065D0EV3Q686CMBSQCDKR1FACC',
    };

    const userGroupPermissionAssignment = {
      permissionId: '065BDR8DCB6M7H3E25336KH3ZC',
      userId: user.userId,
      groupId: group.groupId,
      assignedAt: timeNow,
    };

    const machine = {
      machineId: ulid(),
      machineName: 'machine name',
      pictureUrl: 'string',
      modelAndType: 'DFSEFRE',
      serialNumber: 'serial number',
      serialNumberPlatePictureUrl: '',
      currentStatus: 'CREATED',
      lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
      machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
      machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
      groupId: group.groupId,
    };

    const machineHistory = {
      machineHistoryId: ulid(),
      eventType: 'CREATE',
      machineName: 'machine name',
      eventAt: '2024-01-16T02:00:30.000Z',
      actionedByUserId: user.userId,
      machineId: machine.machineId,
      serialNumberPlatePictureUrl: '',
      machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
      machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
      modelAndType: 'DFSEFRE',
      serialNumber: 'serial number',
      groupId: group.groupId,
      pictureUrl: 'string',
      currentStatus: 'CREATED',
    };

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
        entity: Machine,
        data: machine,
      },
      {
        entity: MachineHistory,
        data: machineHistory,
      },
    ];

    it('DELETE should return machine delete success', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .delete(`/groups/${group.groupId}/machines/${machine.machineId}`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {},
            meta: {
              successMessage: '車両を削除しました。',
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: true,
                allowCreateEditDeleteMember: false,
                allowCreateEditDeleteInspectionForm: false,
                allowCreateInspectionAndReport: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Should return error when handle an invalid group Id', async () => {
      return request(app.getHttpServer())
        .delete(`/groups/${group.groupId}/machines/no-existing`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'machine_histories',
        'machines',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(DELETE) /groups/:groupId/users/:userId/user-assignment-info', () => {
    it('Delete user in group error: You cannot delete yourself."', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .delete(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'You cannot delete yourself.',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('Delete user in group success."', async () => {
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .delete(
          `/groups/${groupId}/users/${userSecond.userId}/user-assignment-info`,
        )
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectedOutput = {
            data: {},
            meta: {
              successMessage: 'Deleted successfully.',
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
                allowCreateEditDeleteInspectionForm: true,
                allowCreateInspectionAndReport: true,
              },
            },
          };

          expect(res.body.data).toEqual(expectedOutput.data);
          expect(res.body.meta).toEqual(expectedOutput.meta);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_ciam_links',
        'users',
        'groups',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(GET) /groups/:groupId/users/:userId/user-assignment-info', () => {
    it('EN: Get users assignment permission in group: Group not found', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Get users assignment permission in group: Group not found', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('EN: Get users assignment permission in group: User not exist', async () => {
      await createRecord(connection, recordInsert.slice(0, 1));
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.body.error.message).toContain(
            'User not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Get users assignment permission in group: User not exist', async () => {
      await createRecord(connection, recordInsert.slice(0, 1));
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.body.error.message).toContain(
            'User not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Get users assignment permission in group: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          const expectedOutput = {
            userId,
            givenName: user.givenName,
            surname: user.surname,
            groupId,
            roleName: userGroupAssignment.userGroupRoleName,
            permissions: [
              {
                isChecked: true,
                isoLocaleCode: 'ja',
                permissionId: '065BDR71D53H2ZBB5RA7334MC4',
                permissionName: '車両の点検、報告の登録',
              },
              {
                isChecked: true,
                isoLocaleCode: 'ja',
                permissionId: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
                permissionName: '点検表の作成・編集・削除',
              },
              {
                isChecked: false,
                isoLocaleCode: 'ja',
                permissionId: '065BDR8DCB6M7H3E25336KH3ZC',
                permissionName: '車両の追加・編集・削除',
              },
              {
                isChecked: true,
                isoLocaleCode: 'ja',
                permissionId: '065BDR92ZNGHX3R18CANF69Z00',
                permissionName: 'メンバーの追加・権限編集・削除',
              },
              {
                isChecked: false,
                isoLocaleCode: 'ja',
                permissionId: '065BDR92ZSK8KXMJZBQKKS9YFX',
                permissionName: 'グループの編集・削除',
              },
            ],
            isAdmin: false,
            userGroupRoleTemplateId:
              userGroupAssignment.userGroupRoleTemplateId,
          };

          expect(res.body).toEqual({
            data: expectedOutput,
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: true,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
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
        'user_ciam_links',
        'users',
        'groups',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(GET) /groups/:groupId/machines', () => {
    it('EN: Get list machine in group: Group not found', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Get list machine in group: Group not found', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('EN: Get list machine in group webAPP: Group not found', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .set('platform', Platform.WEBAPP)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Get list machine in group webAPP: Group not found', async () => {
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .set('platform', Platform.WEBAPP)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Get list machine in group: success', async () => {
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
          entity: Machine,
          data: mockMachine,
        },
        {
          entity: UserGroupMachineFavorite,
          data: mockUserGroupMachineFavorite,
        },
        {
          entity: MachineCondition,
          data: mockGroupMachineCondition,
        },
      ];
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          const expectedOutput = {
            favoriteMachines: [
              {
                machineId: mockMachine[0].machineId,
                machineName: 'mock machine name',
                pictureUrl: 'https://picsum.photos/id/1/200/200',
                modelAndType: 'model and type',
                machineManufacturerName: 'customMachineManufacturerName1',
                machineCondition: 'NORMAL',
                machineReportCount: 0,
                isFavorite: true,
              },
            ],
            unFavoriteMachines: [
              {
                machineId: mockMachine[1].machineId,
                machineName: 'mock machine name 2',
                pictureUrl: 'https://picsum.photos/id/1/200/200',
                modelAndType: 'model and type',
                machineManufacturerName: 'customMachineManufacturerName2',
                machineCondition: 'NORMAL',
                machineReportCount: 0,
                isFavorite: false,
              },
            ],
          };

          expect(res.body).toEqual({
            data: expectedOutput,
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: false,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Get list machine in group webAPP: success', async () => {
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
          entity: Machine,
          data: mockMachine,
        },
        {
          entity: UserGroupMachineFavorite,
          data: mockUserGroupMachineFavorite,
        },
        {
          entity: MachineCondition,
          data: mockGroupMachineCondition,
        },
      ];
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .set('platform', Platform.WEBAPP)
        .expect((res) => {
          const expectedOutput = [
            {
              machineId: mockMachine[0].machineId,
              machineName: 'mock machine name',
              pictureUrl: 'https://picsum.photos/id/1/200/200',
              modelAndType: 'model and type',
              machineManufacturerName: 'customMachineManufacturerName1',
              machineCondition: 'NORMAL',
              machineType: 'customTypeName1',
              reportCount: 0,
              reportOpenCount: 0,
              countReport: 0,
              countReportOpen: 0,
              serialNumber: 'serial number',
              serialNumberPlatePictureUrl:
                'https://picserial.photos/id/1/200/200',
              customMachineManufacturerName: 'customMachineManufacturerName1',
              customTypeName: 'customTypeName1',
              serviceMeter: null,
            },
            {
              machineId: mockMachine[1].machineId,
              reportCount: 0,
              reportOpenCount: 0,
              countReport: 0,
              countReportOpen: 0,
              customMachineManufacturerName: 'customMachineManufacturerName2',
              customTypeName: 'customTypeName2',
              machineName: 'mock machine name 2',
              pictureUrl: 'https://picsum.photos/id/1/200/200',
              modelAndType: 'model and type',
              machineManufacturerName: 'customMachineManufacturerName2',
              machineCondition: 'NORMAL',
              machineType: 'customTypeName2',
              serialNumber: 'serial number',
              serialNumberPlatePictureUrl:
                'https://picserial.photos/id/1/200/200',
              serviceMeter: null,
            },
          ];

          expect(res.body).toEqual({
            data: expectedOutput,
            meta: {
              pageInfo: {
                page: 1,
                total: 2,
              },
              screenPermission: {
                allowCreateEditDeleteInspectionForm: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: false,
                allowEditDeleteGroup: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'machine_conditions',
        'user_group_machine_favorites',
        'machines',
        'users',
        'groups',
      ]);
    });
  });

  describe('(POST) /groups/:groupId/machines', () => {
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
        entity: Machine,
        data: mockMachine,
      },
      {
        entity: UserGroupPermissionAssignment,
        data: userGroupPermissionAssignmentMachine,
      },
    ];
    it('EN: Create new machine in a group: Group not found', async () => {
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Create new machine in a group: Group not found', async () => {
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Create new machine in a group: Bad Request Exception: The serial number exceeds the maximum length.', async () => {
      const input = {
        machineName: '01HCHJ6B2D0Z33J66E42KGXCCZ',
        machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
        pictureUrl: 'pictureUrl',
        machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
        modelAndType: 'model and type create',
        serialNumber: 'serial number create',
        serialNumberPlatePictureUrl: 'serialNumberPlatePictureUrl',
        customTypeName: 'customTypeName3',
        customMachineManufacturerName: 'customMachineManu4',
      };

      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .set('platform', Platform.WEBAPP)
        .send(input)
        .expect((res) => {
          expect(res.body.error.message).toEqual(
            'The serial number exceeds the maximum length.',
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Create new machine in a group: Bad Request Exception: customMachineManufacturerName is invalid.', async () => {
      const input = {
        machineName: '01HCHJ6B2D0Z33J66E42KGXCCZ',
        machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
        pictureUrl: 'pictureUrl',
        machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
        modelAndType: 'model and type create',
        serialNumber: '12',
        serialNumberPlatePictureUrl: 'serialNumberPlatePictureUrl',
        customTypeName: 'customTypeName3',
        customMachineManufacturerName: 'customMachineManu4',
      };
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .set('platform', Platform.WEBAPP)
        .send(input)
        .expect((res) => {
          expect(res.body.error.message).toEqual(
            'customMachineManufacturerName is invalid.',
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Create new machine in a group: success', async () => {
      const input = {
        machineName: '01HCHJ6B2D0Z33J66E42KGXCCZ',
        machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
        pictureUrl: 'pictureUrl',
        machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
        modelAndType: 'model and type create',
        serialNumber: '12',
        serialNumberPlatePictureUrl: 'serialNumberPlatePictureUrl',
        customTypeName: '',
        customMachineManufacturerName: '',
      };
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .set('platform', Platform.WEBAPP)
        .send(input)
        .expect((res) => {
          const expectedOutput = {
            currentStatus: 'CREATED',
            customMachineManufacturerName: null,
            customTypeName: null,
            lastStatusUpdatedAt: res.body.data.lastStatusUpdatedAt,
            machineId: res.body.data.machineId,
            machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
            machineName: '01HCHJ6B2D0Z33J66E42KGXCCZ',
            machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
            modelAndType: 'model and type create',
            pictureUrl: 'pictureUrl',
            serialNumber: '12',
            serialNumberPlatePictureUrl: 'serialNumberPlatePictureUrl',
          };
          expect(res.body).toEqual({
            data: expectedOutput,
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: false,
                allowCreateEditDeleteMachine: true,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: false,
                allowEditDeleteGroup: false,
              },
              successMessage: '車両を追加しました。',
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.CREATED);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'machines',
        'users',
        'groups',
        'user_ciam_links',
        'user_group_assignments',
        'user_group_permission_assignments',
        'machine_histories',
        'machine_conditions',
        'machine_condition_histories',
      ]);
    });
  });

  describe('(PUT) /groups/:groupId/users/:userId/user-assignment-info', () => {
    const timeNow = new Date();
    const group = {
      groupId: ulid(),
      groupName: 'group name',
      location: 'location',
      currentStatus: GroupCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      companyName: 'company name',
    };

    const user = {
      userId: ulid(),
      givenName: 'givenName',
      surname: 'surname',
      pictureUrl: 'https://picsum.photos/id/1/200/200',
      email: 'default-admin@example.com',
      isSearchableByEmail: true,
      registeredAt: timeNow,
      isoLocaleCode: ISOLocaleCode.JA,
      residenceCountryCode: 'JA',
      dateOfBirth: timeNow,
      currentStatus: UserCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      searchId: '000000123',
    };

    const userCiam = {
      userCiamLinkId: ulid(),
      userId: user.userId,
      oid: 'example_oid',
      iss: 'https://exampleiss.com/oid',
      linkedAt: timeNow,
    };

    const userGroupAssignment = {
      userId: user.userId,
      groupId: group.groupId,
      lastStatusUpdatedAt: timeNow,
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      userGroupRoleName: 'mock role name',
      userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
      is_admin: true,
    };

    const userGroupPermissionAssignment = {
      permissionId: '065BDR92ZNGHX3R18CANF69Z00',
      userId: user.userId,
      groupId: group.groupId,
      assignedAt: timeNow,
    };

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
    ];
    const mockInput = {
      isAdmin: true,
      userGroupRoleName: userGroupAssignment.userGroupRoleName,
      permissionIds: [
        '065BDR71D53H2ZBB5RA7334MC4',
        '065BDR7Q6HW2QNZZ3E9S6M9SD8',
        '065BDR8DCB6M7H3E25336KH3ZC',
        '065BDR92ZNGHX3R18CANF69Z00',
        '065BDR92ZSK8KXMJZBQKKS9YFX',
      ],
      userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
    };
    const userId = user.userId || '01HTEYYP932TRC1CB8B81WB28E';
    const groupId = group.groupId || '01HTEXXKCZ7ZXD0JGKKSWGAQ2J';
    it('EN_US: Get users assignment permission in group: Group not found', async () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Get users assignment permission in group: Group not found', async () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('EN_US: Get users assignment permission in group: User not exist', async () => {
      await createRecord(connection, recordInsert.slice(0, 1));
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.body.error.message).toContain(
            'User not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Get users assignment permission in group: User not exist', async () => {
      await createRecord(connection, recordInsert.slice(0, 1));
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.body.error.message).toContain(
            'User not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Get users assignment permission in group: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .send(mockInput)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          const expectedOutput = {
            userId,
            groupId,
            lastStatusUpdatedAt: res.body.data.lastStatusUpdatedAt,
            userGroupRoleName: mockInput.userGroupRoleName,
          };

          expect(res.body).toEqual({
            data: expectedOutput,
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
                allowCreateInspectionAndReport: false,
                allowEditDeleteGroup: false,
              },
              successMessage: 'メンバーを編集しました。',
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Get users assignment permission1 in group: success', async () => {
      const newRecordInsert = recordInsert.map((record) => {
        return {
          ...record,
          data: {
            ...record.data,
            isoLocaleCode: 'en',
          },
        };
      });
      await createRecord(connection, newRecordInsert);
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/users/${userId}/user-assignment-info`)
        .send(mockInput)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectedOutput = {
            userId,
            groupId,
            lastStatusUpdatedAt: res.body.data.lastStatusUpdatedAt,
            userGroupRoleName: mockInput.userGroupRoleName,
          };

          expect(res.body).toEqual({
            data: expectedOutput,
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
                allowCreateInspectionAndReport: false,
                allowEditDeleteGroup: false,
              },
              successMessage: 'Edited successfully.',
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_ciam_links',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
        'groups',
        'users',
      ]);
    });
  });

  describe('(PUT) /groups/:groupId/users/:userId/user-assignment-info', () => {
    const timeNow = new Date();
    const group = {
      groupId: ulid(),
      groupName: 'group name',
      location: 'location',
      currentStatus: GroupCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      companyName: 'company name',
    };

    const user = {
      userId: ulid(),
      givenName: 'givenName',
      surname: 'surname',
      pictureUrl: 'https://picsum.photos/id/1/200/200',
      email: 'default-admin@example.com',
      isSearchableByEmail: true,
      registeredAt: timeNow,
      isoLocaleCode: ISOLocaleCode.JA,
      residenceCountryCode: 'JA',
      dateOfBirth: timeNow,
      currentStatus: UserCurrentStatus.CREATED,
      lastStatusUpdatedAt: timeNow,
      searchId: '000000123',
    };

    const userCiam = {
      userCiamLinkId: ulid(),
      userId: user.userId,
      oid: 'example_oid',
      iss: 'https://exampleiss.com/oid',
      linkedAt: timeNow,
    };

    const userGroupAssignment = {
      userId: user.userId,
      groupId: group.groupId,
      lastStatusUpdatedAt: timeNow,
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      userGroupRoleName: 'mock role name',
      userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
    };

    const userGroupPermissionAssignment = {
      permissionId: '065BDR92ZNGHX3R18CANF69Z00',
      userId: user.userId,
      groupId: group.groupId,
      assignedAt: timeNow,
    };

    const machine = {
      machineId: ulid(),
      machineName: 'machine name',
      pictureUrl: 'string',
      modelAndType: 'DFSEFRE',
      serialNumber: 'serial number',
      serialNumberPlatePictureUrl: '',
      currentStatus: 'CREATED',
      lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
      machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
      machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
      groupId: group.groupId,
    };

    const userGroupMachineFavorites = {
      userId: user.userId,
      groupId: group.groupId,
      machineId: machine.machineId,
    };

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
        entity: Machine,
        data: machine,
      },
      {
        entity: UserGroupMachineFavorite,
        data: userGroupMachineFavorites,
      },
    ];
    const machineId = machine.machineId || '01HW2HBFSP42Q8G65TVE25VZ80';
    const groupId = group.groupId || '01HTEXXKCZ7ZXD0JGKKSWGAQ2J';
    it('EN_US: Update favorite/un-favorite for machines: Group not found', async () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}/favorites`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Update favorite/un-favorite for machines: Group not found', async () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}/favorites`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('EN_US: Update favorite/un-favorite for machines: machine not exist', async () => {
      await createRecord(connection, recordInsert.slice(0, 1));
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}/favorites`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.body.error.message).toContain(
            'Machine not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Update favorite/un-favorite for machines: machine not exist', async () => {
      await createRecord(connection, recordInsert.slice(0, 1));
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}/favorites`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.body.error.message).toContain(
            'Machine not found or not in this group.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Update favorite/un-favorite for machines with no have userGroupMachineFavorites: success', async () => {
      await createRecord(connection, recordInsert.slice(0, 6));
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}/favorites`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {
              status: 'CREATED',
            },
            meta: {
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
                allowCreateEditDeleteInspectionForm: false,
                allowCreateInspectionAndReport: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });
    it('Update favorite/un-favorite for machines have userGroupMachineFavorites: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}/favorites`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {
              status: 'DELETED',
            },
            meta: {
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
                allowCreateEditDeleteInspectionForm: false,
                allowCreateInspectionAndReport: false,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_ciam_links',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
        'machines',
        'user_group_machine_favorites',
        'groups',
        'users',
      ]);
    });
  });

  describe('(POST) /groups/:groupId/machines', () => {
    const machine = {
      machineId: ulid(),
      machineName: 'machine name',
      pictureUrl: 'string',
      modelAndType: 'DFSEFRE',
      serialNumber: 'serial number',
      serialNumberPlatePictureUrl: '',
      currentStatus: 'CREATED',
      lastStatusUpdatedAt: user.lastStatusUpdatedAt,
      machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
      machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
      groupId: group.groupId,
    };

    const userGroupPermissionAssignmentWithMachine = {
      permissionId: '065BDR8DCB6M7H3E25336KH3ZC',
      userId: user.userId,
      groupId: group.groupId,
      assignedAt: user.lastStatusUpdatedAt,
    };

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
        entity: Machine,
        data: machine,
      },
      {
        entity: UserGroupPermissionAssignment,
        data: userGroupPermissionAssignmentWithMachine,
      },
    ];
    const machineId = machine.machineId || '01HW2HBFSP42Q8G65TVE25VZ80';
    const groupId = group.groupId || '01HTEXXKCZ7ZXD0JGKKSWGAQ2J';
    it('EN_US: Create new machine in a group: Group not found', async () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.body.error.localizedMessage).toContain(
            'An unexpected error has occurred. Please try again later.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('JA: Create new machine in a group: Group not found', async () => {
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            '予期しないエラーが発生しました。しばらくしてからアクセスしてください。',
          );
          expect(res.body.error.message).toContain(
            'Group not found or does not belong to this user.',
          );
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    it('Create new machine in a group: Bad Request Exception: The serial number exceeds the maximum length.', async () => {
      const input = {
        machineName: '01HCHJ6B2D0Z33J66E42KGXCCZ',
        machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
        pictureUrl: 'pictureUrl',
        machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
        modelAndType: 'model and type create',
        serialNumber: 'serial number create',
        serialNumberPlatePictureUrl: 'serialNumberPlatePictureUrl',
        customTypeName: 'customTypeName3',
        customMachineManufacturerName: 'customMachineManu4',
      };

      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .send(input)
        .expect((res) => {
          expect(res.body.error.message).toEqual(
            'The serial number exceeds the maximum length.',
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Create new machine in a group: Bad Request Exception: customMachineManufacturerName is invalid.', async () => {
      const input = {
        machineName: '01HCHJ6B2D0Z33J66E42KGXCCZ',
        machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
        pictureUrl: 'pictureUrl',
        machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
        modelAndType: 'model and type create',
        serialNumber: '12',
        serialNumberPlatePictureUrl: 'serialNumberPlatePictureUrl',
        customTypeName: 'customTypeName3',
        customMachineManufacturerName: 'customMachineManu4',
      };
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .send(input)
        .expect((res) => {
          expect(res.body.error.message).toEqual(
            'customMachineManufacturerName is invalid.',
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Create new machine in a group: success', async () => {
      const input = {
        machineName: '01HCHJ6B2D0Z33J66E42KGXCCZ',
        machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
        pictureUrl: 'pictureUrl',
        machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
        modelAndType: 'model and type create',
        serialNumber: '12',
        serialNumberPlatePictureUrl: 'serialNumberPlatePictureUrl',
        customTypeName: '',
        customMachineManufacturerName: '',
      };
      await createRecord(connection, recordInsert);

      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .send(input)
        .expect((res) => {
          const expectedOutput = {
            currentStatus: 'UPDATED',
            customMachineManufacturerName: null,
            customTypeName: null,
            lastStatusUpdatedAt: res.body.data.lastStatusUpdatedAt,
            machineId: res.body.data.machineId,
            machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
            machineName: '01HCHJ6B2D0Z33J66E42KGXCCZ',
            machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
            modelAndType: 'model and type create',
            pictureUrl: 'pictureUrl',
            serialNumber: '12',
            serialNumberPlatePictureUrl: 'serialNumberPlatePictureUrl',
          };
          expect(res.body).toEqual({
            data: expectedOutput,
            meta: {
              screenPermission: {
                allowCreateEditDeleteInspectionForm: false,
                allowCreateEditDeleteMachine: true,
                allowCreateEditDeleteMember: false,
                allowCreateInspectionAndReport: false,
                allowEditDeleteGroup: false,
              },
              successMessage: 'Edited successfully.',
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'machines',
        'users',
        'groups',
        'user_ciam_links',
        'user_group_assignments',
        'user_group_permission_assignments',
        'machine_histories',
        'machine_conditions',
        'machine_condition_histories',
      ]);
    });
  });

  describe('(POST) :groupId/machines/group-machine-assignments', () => {
    const timeNow = new Date();

    const machineId = ulid();
    const record: TableRecord[] = [
      {
        entity: UserGroupPermissionAssignment,
        data: {
          permissionId: '065BDR8DCB6M7H3E25336KH3ZC',
          userId: user.userId,
          groupId: group.groupId,
          assignedAt: timeNow,
        },
      },
      {
        entity: Machine,
        data: {
          machineId: machineId,
          machineName: 'machine name',
          pictureUrl: 'string',
          modelAndType: 'DFSEFRE',
          serialNumber: 'serial number',
          serialNumberPlatePictureUrl: '',
          currentStatus: 'CREATED',
          lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
          machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
          machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
          groupId: groupSecond.groupId,
        },
      },
    ];

    const input = {
      machineIds: [machineId],
    };

    it('POST should return add machine success', async () => {
      await createRecord(connection, recordInsert);
      await createRecord(connection, record);

      return request(app.getHttpServer())
        .post(`/groups/${groupId}/machines/group-machine-assignments`)
        .send(input)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {},
            meta: {
              successMessage: 'Added machine successfully.',
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: true,
                allowCreateEditDeleteMember: true,
                allowCreateEditDeleteInspectionForm: true,
                allowCreateInspectionAndReport: true,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.CREATED);
        });
    });

    it('POST should return error', async () => {
      await createRecord(connection, recordInsert);
      await createRecord(connection, record);

      return request(app.getHttpServer())
        .post(
          `/groups/${groupSecond.groupId}/machines/group-machine-assignments`,
        )
        .send(input)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'machine_histories',
        'machines',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('GET) :groupId/machines/:machineId', () => {
    const machineId = ulid();
    const record: TableRecord[] = [
      {
        entity: Machine,
        data: {
          machineId: machineId,
          machineName: 'machine name',
          pictureUrl: 'string',
          modelAndType: 'DFSEFRE',
          serialNumber: 'serial number',
          serialNumberPlatePictureUrl: '',
          currentStatus: 'CREATED',
          lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
          machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
          machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
          groupId: group.groupId,
        },
      },
      {
        entity: MachineCondition,
        data: {
          machineId: machineId,
          machineCondition: 'NORMAL',
          userId: user.userId,
        },
      },
    ];

    it('GET should return machine info success', async () => {
      await createRecord(connection, recordInsert);
      await createRecord(connection, record);

      return request(app.getHttpServer())
        .get(`/groups/${group.groupId}/machines/${machineId}`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {
              customMachineManufacturerName: null,
              customTypeName: null,
              filePath: 'string',
              isFavorite: false,
              isOtherMachineManufacturer: false,
              isOtherMachineType: false,
              machineCondition: 'NORMAL',
              machineId: machineId,
              machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
              machineManufacturerName: 'KOMATSU',
              machineName: 'machine name',
              machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
              machineTypeName: 'Crawler excavator',
              modelAndType: 'DFSEFRE',
              pictureUrl: 'string',
              serialNumber: 'serial number',
              serialNumberFilePath: null,
              serialNumberPlatePictureUrl: null,
            },
            meta: {
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
                allowCreateEditDeleteInspectionForm: true,
                allowCreateInspectionAndReport: true,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('POST should return error', async () => {
      await createRecord(connection, recordInsert);
      await createRecord(connection, record);

      return request(app.getHttpServer())
        .get(`/groups/${groupSecond.groupId}/machines/${machineId}`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'machine_histories',
        'machines',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(PUT) :groupId/machines/:machineId/machine-conditions', () => {
    const machineId = ulid();
    const record: TableRecord[] = [
      {
        entity: Machine,
        data: {
          machineId: machineId,
          machineName: 'machine name',
          pictureUrl: 'string',
          modelAndType: 'DFSEFRE',
          serialNumber: 'serial number',
          serialNumberPlatePictureUrl: '',
          currentStatus: 'CREATED',
          lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
          machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
          machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
          groupId: groupId,
        },
      },
      {
        entity: MachineCondition,
        data: {
          machineId: machineId,
          machineCondition: 'NORMAL',
          userId: user.userId,
        },
      },
    ];

    it('PUT should update machine condition success', async () => {
      await createRecord(connection, recordInsert);
      await createRecord(connection, record);

      const input = {
        machineCondition: 'WARNING',
      };

      return request(app.getHttpServer())
        .put(`/groups/${groupId}/machines/${machineId}/machine-conditions`)
        .send(input)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: { machineCondition: 'WARNING' },
            meta: {
              screenPermission: {
                allowEditDeleteGroup: false,
                allowCreateEditDeleteMachine: false,
                allowCreateEditDeleteMember: true,
                allowCreateEditDeleteInspectionForm: true,
                allowCreateInspectionAndReport: true,
              },
            },
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('PUT should update machine condition error', async () => {
      await createRecord(connection, recordInsert);
      await createRecord(connection, record);

      const input = {
        machineCondition: 'WARNING',
      };

      return request(app.getHttpServer())
        .put(
          `/groups/${groupId}/machines/${machine.machineId}/machine-conditions`,
        )
        .send(input)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'machine_histories',
        'machines',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_settings',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  afterAll(async () => {
    await clearDatabase(connection, [
      'user_ciam_links',
      'group_invitations',
      'user_group_assignments',
      'users',
      'groups',
    ]);
    await app.close();
    await connection.destroy();
  });
});
