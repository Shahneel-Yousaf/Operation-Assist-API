import { IrregularMaintenanceItemChoice } from '@template/entities';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { MaintenanceReport } from '.';

@Entity('maintenance_report_irregular_maintenance_items')
export class MaintenanceReportIrregularMaintenanceItem extends BaseEntity {
  @PrimaryColumn({ name: 'machine_report_response_id' })
  machineReportResponseId: string;

  @PrimaryColumn({ name: 'irregular_maintenance_item_choice_id' })
  irregularMaintenanceItemChoiceId: string;

  @ManyToOne(
    () => MaintenanceReport,
    (maintenanceReport) =>
      maintenanceReport.maintenanceReportIrregularMaintenanceItems,
  )
  @JoinColumn({ name: 'machine_report_response_id' })
  maintenanceReport: MaintenanceReport;

  @ManyToOne(
    () => IrregularMaintenanceItemChoice,
    (irregularMaintenanceItemChoice) =>
      irregularMaintenanceItemChoice.maintenanceReportIrregularMaintenanceItems,
  )
  @JoinColumn([
    {
      name: 'irregular_maintenance_item_choice_id',
      referencedColumnName: 'irregularMaintenanceItemChoiceId',
    },
  ])
  irregularMaintenanceItemChoice: IrregularMaintenanceItemChoice;
}
