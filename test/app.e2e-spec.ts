import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { FirebaseService } from '@firebase/services/firebase.service';
import {
  INestApplication,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
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
    app.setGlobalPrefix('/v1');
    const appModule = app.get(AppModule);
    appModule.configure = function (consumer: MiddlewareConsumer) {
      consumer
        .apply((req, res, next) => {
          next();
        })
        .exclude({
          path: 'health-check',
          method: RequestMethod.GET,
        })
        .forRoutes('*');
    };
    await app.init();
  });

  it('(GET) /v1/health-check', () => {
    return request(app.getHttpServer())
      .get('/v1/health-check')
      .expect(200)
      .expect('Health check ok!');
  });

  afterAll(async () => {
    await app.close();
  });
});
