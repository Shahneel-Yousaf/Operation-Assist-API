import { BlobStorageModule } from '@blob-storage/blob-storage.module';
import { FirebaseModule } from '@firebase/firebase.module';
import { GraphApiModule } from '@graph-api/graph-api.module';
import { GroupModule } from '@group/group.module';
import { InspectionModule } from '@inspection/inspection.module';
import { MachineModule } from '@machine/machine.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { excludeRoutes } from '@shared/constants';
import { AllExceptionsFilter } from '@shared/filters/all-exceptions.filter';
import { AuthGuard } from '@shared/guards/auth.guard';
import {
  LoggingInterceptor,
  PathParamsCheckInterceptor,
  PermissionInterceptor,
  ResponseInterceptor,
} from '@shared/interceptors';
import { CheckForceUpdateVersionMiddleware } from '@shared/middlewares/check-force-update-version/check-force-update-version.middleware';
import { SharedModule } from '@shared/shared.module';
import { TemplateModule } from '@template/template.module';
import { UserModule } from '@user/user.module';
import { UserGroupRoleTemplateModule } from '@user-group-role-template/user-group-role-template.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MachineReportModule } from './machine-report/machine-report.module';

@Module({
  imports: [
    SharedModule,
    UserModule,
    GroupModule,
    UserGroupRoleTemplateModule,
    BlobStorageModule,
    MachineModule,
    TemplateModule,
    InspectionModule,
    MachineReportModule,
    FirebaseModule,
    GraphApiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    { provide: APP_GUARD, useExisting: AuthGuard },
    AuthGuard,
    { provide: APP_INTERCEPTOR, useClass: PathParamsCheckInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: PermissionInterceptor },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckForceUpdateVersionMiddleware)
      .exclude(...excludeRoutes)
      .forRoutes('*');
  }
}
