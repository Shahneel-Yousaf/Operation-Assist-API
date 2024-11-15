import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { BlobStorageFileService } from '@blob-storage/services/blob-storage-file.service';
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
import { ISOLocaleCode, VALIDATION_PIPE_OPTIONS } from '@shared/constants';
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

describe('MachineTypeController (e2e): Unauthorized', () => {
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

  describe('(GET) /machine-related-info', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .get(`/machine-related-info`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .get(`/machine-related-info`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('MachineTypeController (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource;
  beforeAll(async () => {
    connection = await typeOrmConfig.initialize();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideProvider(BlobStorageService)
      .useValue({ generateSasUrl: (image: string) => image })
      .overrideProvider(FirebaseService)
      .useValue({})
      .overrideProvider(BlobStorageFileService)
      .useValue({ getFileContent: () => '{}' })
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

  describe('(GET) /machine-related-info', () => {
    it('Should return unauthorized user not exist', async () => {
      return request(app.getHttpServer())
        .get(`/machine-related-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.error.message).toContain('User not exist.');
          expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    it('Should return machine related info success', async () => {
      await createRecord(connection, recordInsert);
      return request(app.getHttpServer())
        .get(`/machine-related-info`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });
  });

  afterAll(async () => {
    await clearDatabase(connection, []);
    await app.close();
    await connection.destroy();
  });
});
