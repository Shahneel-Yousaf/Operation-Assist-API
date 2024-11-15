import { FirebaseService } from '@firebase/services/firebase.service';
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
import { User, UserCiamLink } from '@user/entities';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import typeOrmConfig from '../../ormconfig.test';
import { AppModule } from '../../src/app.module';
import { user, userCiam } from '..//mock/data.mock';
import { mockAuthGuard } from '../mock/guard.mock';
import { clearDatabase, createRecord, TableRecord } from '../test-utils';

describe('UserGroupRoleTemplateController (e2e): Unauthorized', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
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

  describe('(GET) /group-role-templates', () => {
    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .get('/group-role-templates')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .get('/group-role-templates')
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});

describe('UserGroupRoleTemplateController (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource;
  beforeAll(async () => {
    connection = await typeOrmConfig.initialize();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthGuard)
      .useValue(mockAuthGuard)
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
    await clearDatabase(connection, ['user_ciam_links', 'users']);
  });

  describe('(GET) /group-role-templates', () => {
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

    it('Get template roles permissions', async () => {
      await createRecord(connection, recordInsert);

      const expectedOutput = {
        userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
        roleCode: 'role code 1',
        isAdmin: true,
        userGroupRoleNameTranslation: {
          userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
          isoLocaleCode: 'en',
          roleName: 'Group manager',
        },
        permissionTranslates: [
          {
            permissionId: '065BDR71D53H2ZBB5RA7334MC4',
            isoLocaleCode: 'en',
            permissionName: 'Inspect machine and register report',
            isChecked: true,
          },
          {
            permissionId: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
            isoLocaleCode: 'en',
            permissionName: 'Create/edit/delete inspection form',
            isChecked: true,
          },
          {
            permissionId: '065BDR8DCB6M7H3E25336KH3ZC',
            isoLocaleCode: 'en',
            permissionName: 'Add/edit/remove machine',
            isChecked: true,
          },
          {
            permissionId: '065BDR92ZNGHX3R18CANF69Z00',
            isoLocaleCode: 'en',
            permissionName: 'Add member/edit permissions/delete',
            isChecked: true,
          },
          {
            permissionId: '065BDR92ZSK8KXMJZBQKKS9YFX',
            isoLocaleCode: 'en',
            permissionName: 'Edit/delete group',
            isChecked: true,
          },
        ],
      };

      return request(app.getHttpServer())
        .get('/group-role-templates')
        .set('Authorization', 'Bearer valid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .expect((res) => {
          expect(res.body.data[0]).toEqual(expectedOutput);
          expect(res.body.meta).toEqual({});
          expect(res.statusCode).toEqual(HttpStatus.OK);
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await connection.destroy();
  });
});
