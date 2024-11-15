import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { NotificationRepository } from '@firebase/repositories';
import { FirebaseService } from '@firebase/services/firebase.service';
import { Group } from '@group/entities';
import { GroupRepository } from '@group/repositories';
import { MachineRepository } from '@machine/repositories';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import {
  UserCiamLinkRepository,
  UserGroupAssignmentRepository,
  UserRepository,
} from '@user/repositories';

import { InspectionController } from './controllers/inspection.controller';
import {
  CustomInspectionForm,
  CustomInspectionFormHistory,
  CustomInspectionItem,
  CustomInspectionItemMedia,
  Inspection,
  InspectionFormTemplate,
  InspectionFormTemplateTranslation,
  InspectionHistory,
  InspectionItemTemplate,
  InspectionItemTemplateTranslation,
  InspectionResult,
  InspectionResultHistory,
} from './entities';
import {
  CustomInspectionFormRepository,
  CustomInspectionItemRepository,
  InspectionFormTemplateRepository,
  InspectionFormTemplateTranslationRepository,
  InspectionRepository,
} from './repositories';
import { InspectionService } from './services/inspection.service';

@Module({
  controllers: [InspectionController],
  providers: [
    InspectionService,
    BlobStorageService,
    CustomInspectionFormRepository,
    InspectionFormTemplateTranslationRepository,
    InspectionFormTemplateRepository,
    InspectionRepository,
    FirebaseService,
    NotificationRepository,
    UserRepository,
    CustomInspectionItemRepository,
    GroupRepository,
    UserGroupAssignmentRepository,
    MachineRepository,
    UserCiamLinkRepository,
  ],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      CustomInspectionForm,
      CustomInspectionFormHistory,
      InspectionFormTemplate,
      InspectionItemTemplateTranslation,
      CustomInspectionItemMedia,
      Inspection,
      InspectionHistory,
      InspectionItemTemplate,
      CustomInspectionItem,
      InspectionFormTemplateTranslation,
      InspectionResult,
      InspectionResultHistory,
      Group,
    ]),
  ],
})
export class InspectionModule {}
