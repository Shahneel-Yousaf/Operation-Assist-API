import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';

import { MaintenanceReportController } from './controllers/maintenance-report.controller';
import { OilTypeController } from './controllers/oil-type.controller';
import { PartTypeController } from './controllers/part-type.controller';
import { ReportActionChoiceController } from './controllers/report-action-choice.controller';
import {
  ReportAction,
  ReportActionChoice,
  ReportActionChoiceTranslation,
} from './entities';
import {
  IrregularMaintenanceItemChoiceRepository,
  MaintenanceReasonChoiceRepository,
  MaintenanceReasonPeriodChoiceRepository,
  PartTypeRepository,
  RegularMaintenanceItemChoiceRepository,
  ReportActionChoiceRepository,
} from './repositories';
import { OilTypeRepository } from './repositories/oil-type.repository';
import { MaintenanceReportService } from './services/maintenance-report.service';
import { OilTypeService } from './services/oil-type.service';
import { PartTypeService } from './services/part-type.service';
import { ReportActionChoiceService } from './services/report-action-choice.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      ReportActionChoice,
      ReportActionChoiceTranslation,
      ReportAction,
    ]),
  ],
  controllers: [
    ReportActionChoiceController,
    OilTypeController,
    PartTypeController,
    MaintenanceReportController,
  ],
  providers: [
    ReportActionChoiceService,
    ReportActionChoiceRepository,
    PartTypeService,
    PartTypeRepository,
    OilTypeService,
    OilTypeRepository,
    MaintenanceReportService,
    IrregularMaintenanceItemChoiceRepository,
    RegularMaintenanceItemChoiceRepository,
    MaintenanceReasonChoiceRepository,
    MaintenanceReasonPeriodChoiceRepository,
  ],
})
export class TemplateModule {}
