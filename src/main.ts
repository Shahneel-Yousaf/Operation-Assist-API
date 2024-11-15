import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ParameterObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { AppModule } from './app.module';
import {
  defaultExamples,
  SUPPORT_VERSION,
  VALIDATION_PIPE_OPTIONS,
} from './shared/constants';
import { RequestIdMiddleware } from './shared/middlewares/request-id/request-id.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.use(RequestIdMiddleware);
  app.enableCors();

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
      ignoreDecorators: true,
    }),
  );

  /** Enable version */
  app.enableVersioning({
    defaultVersion: SUPPORT_VERSION,
    type: VersioningType.URI,
    prefix: '',
  });

  const configService = app.get(ConfigService);

  /** Swagger configuration*/
  if (configService.get<string>('env') !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Nestjs API starter')
      .setDescription('Nestjs API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addGlobalParameters(
        defaultExamples.os as ParameterObject,
        defaultExamples.version as ParameterObject,
      )
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }

  const port = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();
