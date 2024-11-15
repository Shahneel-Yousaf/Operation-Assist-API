import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { GraphAPIService } from '@graph-api/services/graph-api.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';

import { UserController } from './controllers/user.controller';
import { User, UserGroupAssignment } from './entities';
import {
  DeviceRepository,
  UserCiamLinkRepository,
  UserGroupAssignmentRepository,
  UserRepository,
  UserSettingRepository,
} from './repositories';
import { UserService } from './services/user.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([User, UserGroupAssignment]),
  ],
  providers: [
    UserService,
    UserRepository,
    UserGroupAssignmentRepository,
    UserCiamLinkRepository,
    BlobStorageService,
    UserSettingRepository,
    DeviceRepository,
    GraphAPIService,
  ],
  controllers: [UserController],
  exports: [
    UserService,
    UserRepository,
    UserGroupAssignmentRepository,
    UserCiamLinkRepository,
  ],
})
export class UserModule {}
