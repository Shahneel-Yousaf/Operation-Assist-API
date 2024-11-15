import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { FirebaseService } from '@firebase/services/firebase.service';
import { Group } from '@group/entities';
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
  ReportActionChoiceCode,
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
  user,
  userCiam,
  userGroupAssignment,
  userGroupPermissionAssignment,
  userGroupSetting,
} from '../mock/data.mock';
import { mockAuthGuard } from '../mock/guard.mock';
import { clearDatabase, createRecord, TableRecord } from '../test-utils';

describe('ReportActionChoiceController (e2e): Unauthorized', () => {
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

  describe('(GET) /report-action-choices', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(`/report-action-choices`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(`/report-action-choices`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('ReportActionChoiceController (e2e)', () => {
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
  ];

  describe('(GET) /report-action-choices', () => {
    it('Should return machine report action choices', async () => {
      return request(app.getHttpServer())
        .get(`/report-action-choices`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain('User not exist.');
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    it('Should return machine report action choices', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(`/report-action-choices`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          const expectedOutput = [
            {
              reportActionChoiceId: '0667RPVE4N1END6NE1V9QCHW8W',
              reportActionChoiceCode: ReportActionChoiceCode.SELF_REPAIR,
              isoLocaleCode: ISOLocaleCode.EN,
              reportActionChoiceName: 'Self repair',
            },
            {
              reportActionChoiceId: '0667RPVE4Q3VTC6BJ03Z0HXJG4',
              reportActionChoiceCode: ReportActionChoiceCode.REPAIR_REQUEST,
              isoLocaleCode: ISOLocaleCode.EN,
              reportActionChoiceName:
                'Repair request (Distributor/Manufacturer)',
            },
          ];
          expect(res.body).toEqual({ data: expectedOutput, meta: {} });
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
