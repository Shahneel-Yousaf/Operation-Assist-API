import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { BlobStorageFileService } from '@blob-storage/services/blob-storage-file.service';
import {
  CustomInspectionFormRepository,
  CustomInspectionItemMediaRepository,
  CustomInspectionItemRepository,
} from '@inspection/repositories';
import {
  MachineManufacturerRepository,
  MachineRepository,
  MachineTypeRepository,
  UserGroupMachineFavoriteRepository,
} from '@machine/repositories';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import { ReportActionChoiceRepository } from '@template/repositories';
import { UserGroupAssignment, UserGroupSetting } from '@user/entities';
import {
  UserGroupAssignmentRepository,
  UserGroupSettingRepository,
  UserRepository,
} from '@user/repositories';
import {
  Permission,
  UserGroupRoleTemplate,
} from '@user-group-role-template/entities';
import { PermissionRepository } from '@user-group-role-template/repositories/permission.repository';
import { UserGroupRoleTemplateRepository } from '@user-group-role-template/repositories/user-group-role-template.repository';

import { GroupController } from './controllers/group.controller';
import { Group, GroupHistory, GroupInvitation } from './entities';
import { GroupInvitationRepository, GroupRepository } from './repositories';
import { GroupService } from './services/group.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      Group,
      Permission,
      GroupHistory,
      UserGroupRoleTemplate,
      GroupInvitation,
      UserGroupAssignment,
      UserGroupSetting,
    ]),
  ],
  providers: [
    GroupService,
    GroupRepository,
    UserGroupRoleTemplateRepository,
    UserRepository,
    PermissionRepository,
    GroupInvitationRepository,
    UserGroupAssignmentRepository,
    UserGroupSettingRepository,
    BlobStorageService,
    UserGroupMachineFavoriteRepository,
    MachineManufacturerRepository,
    MachineTypeRepository,
    MachineRepository,
    ReportActionChoiceRepository,
    BlobStorageFileService,
    CustomInspectionFormRepository,
    CustomInspectionItemRepository,
    CustomInspectionItemMediaRepository,
  ],
  controllers: [GroupController],
  exports: [GroupService, GroupRepository],
})
export class GroupModule {}
