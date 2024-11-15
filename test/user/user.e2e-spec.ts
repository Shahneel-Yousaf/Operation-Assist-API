import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { FirebaseService } from '@firebase/services/firebase.service';
import { GraphAPIService } from '@graph-api/services/graph-api.service';
import { Group } from '@group/entities';
import {
  HttpStatus,
  INestApplication,
  MiddlewareConsumer,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ISOLocaleCode, VALIDATION_PIPE_OPTIONS } from '@shared/constants';
import { AuthGuard } from '@shared/guards/auth.guard';
import {
  User,
  UserCiamLink,
  UserGroupAssignment,
  UserGroupPermissionAssignment,
  UserSetting,
} from '@user/entities';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import typeOrmConfig from '../../ormconfig.test';
import { AppModule } from '../../src/app.module';
import {
  group,
  registerUserInput,
  updateUserDeviceInput,
  updateUserProfileInput,
  updateUserSettingInput,
  user,
  userCiam,
  userGroupAssignment,
  userGroupPermissionAssignment,
  userSetting,
} from '../mock/data.mock';
import { mockAuthGuard } from '../mock/guard.mock';
import { clearDatabase, createRecord, TableRecord } from '../test-utils';

describe('UserController (e2e): Unauthorized', () => {
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

  describe('(GET) /users/me', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(POST) /users', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /users/me', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .put('/users/me')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .put('/users/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /users/permissions', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .get('/users/permissions')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .get('/users/permissions')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /users/settings', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .get('/users/settings')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .get('/users/settings')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(PUT) /users/devices', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .put('/users/devices')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .put('/users/devices')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(DELETE) /users/me', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .delete('/users/me')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(GET) /users/settings', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .get('/users/settings')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .get('/users/settings')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('(DELETE) /users/me', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .delete('/users/me')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource;
  beforeAll(async () => {
    connection = await typeOrmConfig.initialize();
    await clearDatabase(connection, [
      'user_histories',
      'user_ciam_links',
      'users',
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
      .overrideProvider(GraphAPIService)
      .useValue({ deleteB2CUser: () => {} })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
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

  describe('(POST) /users', () => {
    it('Should return user register success', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(registerUserInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect(HttpStatus.CREATED);

      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data.givenName).toEqual(registerUserInput.givenName);
      expect(response.body.data.email).toEqual(registerUserInput.email);
    });

    it('should thow BadRequestException if user is already in use.', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(registerUserInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect(HttpStatus.CREATED);

      const duplicateUserResponse = await request(app.getHttpServer())
        .post('/users')
        .send(registerUserInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect(HttpStatus.BAD_REQUEST);

      expect(duplicateUserResponse.body.error.statusCode).toBe(
        HttpStatus.BAD_REQUEST,
      );
      expect(duplicateUserResponse.body.error.message).toBe(
        'This user is already in use.',
      );
    });

    it('BadRequestException: email is wrong format.', async () => {
      const input = {
        name: 'Default Admin User',
        pictureUrl: 'https://picsum.photos/id/1/200/200',
        email: 'test@example',
        isoLocaleCode: ISOLocaleCode.EN,
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
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('BadRequestException: User email not match. with x-lang: en-US', async () => {
      const input = {
        name: 'Default Admin User',
        pictureUrl: 'https://picsum.photos/id/1/200/200',
        email: 'test@example.com',
        isoLocaleCode: ISOLocaleCode.EN,
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
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_histories',
        'user_ciam_links',
        'users',
      ]);
    });
  });

  describe('(GET) /users/me', () => {
    const recordInsert: TableRecord[] = [
      {
        entity: User,
        data: user,
      },
      {
        entity: UserCiamLink,
        data: userCiam,
      },
      {
        entity: UserSetting,
        data: userSetting,
      },
    ];

    it('Get user me success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectedOutput = {
            ...user,
            searchId: res.body.data.searchId,
            registeredAt: res.body.data.registeredAt,
            lastStatusUpdatedAt: res.body.data.lastStatusUpdatedAt,
            userCiamLinks: res.body.data.userCiamLinks,
            userSetting: res.body.data.userSetting,
            suppressDataUsagePopup: false,
          };
          expect(res.body).toEqual({ data: expectedOutput, meta: {} });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_histories',
        'user_ciam_links',
        'users',
      ]);
    });
  });

  describe('(PUT) /users/me', () => {
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

    it('Should return user if user update successfully', async () => {
      await createRecord(connection, recordInsert);
      const response = await request(app.getHttpServer())
        .put('/users/me')
        .send(updateUserProfileInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect(HttpStatus.OK);

      const expectedOutput = {
        ...updateUserProfileInput,
        email: response.body.data.email,
        currentStatus: response.body.data.currentStatus,
        lastStatusUpdatedAt: response.body.data.lastStatusUpdatedAt,
        registeredAt: response.body.data.registeredAt,
        searchId: response.body.data.searchId,
        userId: response.body.data.userId,
      };
      expect(response.body).toEqual({ data: expectedOutput, meta: {} });
    });

    it('Should return NotFoundException if user not found', async () => {
      return request(app.getHttpServer())
        .put('/users/me')
        .send(updateUserProfileInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.message).toEqual('User not exist.');
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });
    it('BadRequestException: email is wrong format.', async () => {
      await createRecord(connection, recordInsert);
      const updateUserProfileInputWrongFormatEmail = updateUserProfileInput;
      updateUserProfileInputWrongFormatEmail.email = 'test@examplecom';
      return request(app.getHttpServer())
        .put('/users/me')
        .send(updateUserProfileInputWrongFormatEmail)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.details.message[0]).toEqual(
            'email is wrong format.',
          );
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_histories',
        'user_ciam_links',
        'users',
      ]);
    });
  });

  describe('(GET) /users/permissions', () => {
    const recordInsert: TableRecord[] = [
      {
        entity: User,
        data: user,
      },
      {
        entity: UserCiamLink,
        data: userCiam,
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
    ];

    it('Error EN: You do not have permission to access this group.', async () => {
      await createRecord(connection, recordInsert.slice(0, 2));
      return request(app.getHttpServer())
        .get(`/users/permissions?groupId=${group.groupId}`)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'You do not have access authority.',
          );
          expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
        });
    });

    it('Error JA: You do not have permission to access this group.', async () => {
      await createRecord(connection, recordInsert.slice(0, 2));
      return request(app.getHttpServer())
        .get(`/users/permissions?groupId=${group.groupId}`)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.localizedMessage).toContain(
            'アクセス権限がありません。',
          );
          expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
        });
    });

    it('Get permissions: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get('/users/permissions')
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectedOutput = {
            exp: res.body.data.exp,
            groups: [
              {
                groupId: group.groupId,
                permissions: {
                  INSPECTIONS_AND_MACHINE_REPORTS: 'READ_CREATE',
                  CUSTOM_INSPECTION_FORMS: 'READ_CREATE_UPDATE',
                },
              },
            ],
            userId: user.userId,
          };
          expect(res.body).toEqual({ data: expectedOutput, meta: {} });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Get permissions has query: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(`/users/permissions?groupId=${group.groupId}`)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          const expectedOutput = {
            exp: res.body.data.exp,
            groups: [
              {
                groupId: group.groupId,
                permissions: {
                  INSPECTIONS_AND_MACHINE_REPORTS: 'READ_CREATE',
                  CUSTOM_INSPECTION_FORMS: 'READ_CREATE_UPDATE',
                },
              },
            ],
            userId: user.userId,
          };
          expect(res.body).toEqual({ data: expectedOutput, meta: {} });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_histories',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(PUT) /users/settings', () => {
    const recordInsert: TableRecord[] = [
      {
        entity: User,
        data: user,
      },
      {
        entity: UserSetting,
        data: userSetting,
      },
      {
        entity: UserCiamLink,
        data: userCiam,
      },
    ];
    it('Should return user setting if user setting update successfully', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put('/users/settings')
        .send(updateUserSettingInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {
              reportNotification: true,
              inspectionNotification: true,
              suppressDataUsagePopup: true,
            },
            meta: {},
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Should return NotFoundException if user not found', async () => {
      return request(app.getHttpServer())
        .put('/users/settings')
        .send(updateUserSettingInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.JA)
        .expect((res) => {
          expect(res.body.error.message).toEqual('User not exist.');
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_settings',
        'user_ciam_links',
        'users',
      ]);
    });
  });

  describe('(PUT) /users/devices', () => {
    const recordInsert: TableRecord[] = [
      {
        entity: User,
        data: user,
      },
      {
        entity: UserCiamLink,
        data: userCiam,
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
    ];

    it('Update device: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put('/users/devices')
        .send(updateUserDeviceInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectedOutput = {
            ...res.body.data,
            ...updateUserDeviceInput,
          };

          expect(res.body).toEqual({ data: expectedOutput, meta: {} });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Update device: error', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put('/users/devices')
        .send({ ...updateUserDeviceInput, deviceType: 'IOSo' })
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toEqual('Bad Request Exception');
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_histories',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(DELETE) /users/me', () => {
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

    it('Delete user: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .delete('/users/me')
        .send(updateUserDeviceInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({ data: {}, meta: {} });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_histories',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(PUT) /users/devices', () => {
    const recordInsert: TableRecord[] = [
      {
        entity: User,
        data: user,
      },
      {
        entity: UserCiamLink,
        data: userCiam,
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
    ];

    it('Update device: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put('/users/devices')
        .send(updateUserDeviceInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectedOutput = {
            ...res.body.data,
            ...updateUserDeviceInput,
          };

          expect(res.body).toEqual({ data: expectedOutput, meta: {} });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Update device: error', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put('/users/devices')
        .send({ ...updateUserDeviceInput, deviceType: 'IOSo' })
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toEqual('Bad Request Exception');
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_histories',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(DELETE) /users/me', () => {
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

    it('Delete user: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .delete('/users/me')
        .send(updateUserDeviceInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({ data: {}, meta: {} });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_histories',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });
  describe('(PUT) /users/devices', () => {
    const recordInsert: TableRecord[] = [
      {
        entity: User,
        data: user,
      },
      {
        entity: UserCiamLink,
        data: userCiam,
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
    ];

    it('Update device: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put('/users/devices')
        .send(updateUserDeviceInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectedOutput = {
            ...res.body.data,
            ...updateUserDeviceInput,
          };

          expect(res.body).toEqual({ data: expectedOutput, meta: {} });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Update device: error', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .put('/users/devices')
        .send({ ...updateUserDeviceInput, deviceType: 'IOSo' })
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toEqual('Bad Request Exception');
          expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_histories',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(DELETE) /users/me', () => {
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

    it('Delete user: success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .delete('/users/me')
        .send(updateUserDeviceInput)
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({ data: {}, meta: {} });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_histories',
        'user_ciam_links',
        'users',
        'groups',
        'user_group_assignments',
        'user_group_permission_assignments',
      ]);
    });
  });

  describe('(GET) /users/settings', () => {
    const recordInsert: TableRecord[] = [
      {
        entity: User,
        data: user,
      },
      {
        entity: UserSetting,
        data: userSetting,
      },
      {
        entity: UserCiamLink,
        data: userCiam,
      },
    ];
    it('Should return user setting if user setting get successfully', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get('/users/settings')
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {
              inspectionNotification: true,
              reportNotification: true,
              userId: userSetting.userId,
              suppressDataUsagePopup: false,
            },
            meta: {},
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Should return NotFoundException if user not found', async () => {
      return request(app.getHttpServer())
        .get('/users/settings')
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toEqual('User not exist.');
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_settings',
        'user_ciam_links',
        'users',
      ]);
    });
  });

  describe('(DELETE) /users/me', () => {
    const recordInsert: TableRecord[] = [
      {
        entity: User,
        data: user,
      },
      {
        entity: UserCiamLink,
        data: userCiam,
      },
      {
        entity: Group,
        data: group,
      },
      {
        entity: UserGroupAssignment,
        data: userGroupAssignment,
      },
    ];
    it('Should return success if delete user successfully', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body).toEqual({
            data: {},
            meta: {},
          });
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('Should return NotFoundException if user not found', async () => {
      return request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toEqual('User not exist.');
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, [
        'user_ciam_links',
        'user_histories',
        'user_group_assignment_histories',
        'user_group_assignments',
        'groups',
        'users',
      ]);
    });
  });

  afterAll(async () => {
    await app.close();
    await connection.destroy();
  });
});
