import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { NotificationRepository } from '@firebase/repositories';
import { FirebaseService } from '@firebase/services/firebase.service';
import { GroupRepository } from '@group/repositories';
import {
  CustomInspectionFormHistoryRepository,
  InspectionHistoryRepository,
  InspectionRepository,
} from '@inspection/repositories';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import {
  IrregularMaintenanceItemChoiceRepository,
  MaintenanceReasonChoiceRepository,
  MaintenanceReasonPeriodChoiceRepository,
  RegularMaintenanceItemChoiceRepository,
  ReportActionChoiceRepository,
} from '@template/repositories';
import {
  UserCiamLinkRepository,
  UserGroupAssignmentRepository,
  UserRepository,
} from '@user/repositories';

import { MachineReportController } from './controllers/machine-report.controller';
import { MachineReportControllerV1 } from './controllers/machine-report-v1.controller';
import {
  MachineReport,
  MachineReportHistory,
  MachineReportMedia,
  MachineReportResponse,
  MachineReportUserRead,
} from './entities';
import {
  MachineReportHistoryRepository,
  MachineReportRepository,
  MachineReportUserReadRepository,
} from './repositories';
import { MachineReportService } from './services/machine-report.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      MachineReport,
      MachineReportHistory,
      MachineReportMedia,
      MachineReportResponse,
      MachineReportUserRead,
    ]),
  ],
  providers: [
    MachineReportService,
    BlobStorageService,
    MachineReportHistoryRepository,
    MachineReportUserReadRepository,
    MachineReportRepository,
    ReportActionChoiceRepository,
    InspectionHistoryRepository,
    CustomInspectionFormHistoryRepository,
    FirebaseService,
    NotificationRepository,
    UserRepository,
    GroupRepository,
    UserGroupAssignmentRepository,
    InspectionRepository,
    UserCiamLinkRepository,
    IrregularMaintenanceItemChoiceRepository,
    RegularMaintenanceItemChoiceRepository,
    MaintenanceReasonChoiceRepository,
    MaintenanceReasonPeriodChoiceRepository,
  ],
  controllers: [MachineReportControllerV1, MachineReportController],
  exports: [MachineReportService, MachineReportRepository],
})
export class MachineReportModule {}
