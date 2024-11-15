import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
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
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import typeOrmConfig from '../../ormconfig.test';
import { AppModule } from '../../src/app.module';
import { mockAuthGuard } from '../mock/guard.mock';
import { clearDatabase } from '../test-utils';

describe('BlobStorageController (e2e): Unauthorized', () => {
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

  describe('(POST) /blob-storage/generate-upload-url', () => {
    it('Unauthorized error when BearerToken is not provided', () => {
      return request(app.getHttpServer())
        .post(`/blob-storage/generate-upload-url`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', () => {
      return request(app.getHttpServer())
        .post(`/blob-storage/generate-upload-url`)
        .set('Authorization', 'Bearer invalid_token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('BlobStorageController (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource;
  beforeAll(async () => {
    connection = await typeOrmConfig.initialize();
    await clearDatabase(connection, []);
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideProvider(BlobStorageService)
      .useValue({ generateUploadUrl: jest.fn() })
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
    await clearDatabase(connection, []);
  });

  describe('(POST) /blob-storage/generate-upload-url', () => {
    it('generate upload url success', async () => {
      const input = {
        type: 'users',
        fileName: 'test.png',
      };
      return request(app.getHttpServer())
        .post(`/blob-storage/generate-upload-url`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .send(input)
        .expect((res) => {
          expect(res.status).toEqual(HttpStatus.CREATED);
        });
    });

    it('generate upload url 400', async () => {
      const input = {
        type: '',
        fileName: 'test.png',
      };
      return request(app.getHttpServer())
        .post(`/blob-storage/generate-upload-url`)
        .set('Authorization', 'Bearer invalid_token')
        .set('x-lang', ISOLocaleCode.EN)
        .send(input)
        .expect((res) => {
          expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    afterEach(async () => {
      await clearDatabase(connection, []);
    });
  });

  afterAll(async () => {
    await clearDatabase(connection, []);
    await app.close();
    await connection.destroy();
  });
});
