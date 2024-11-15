import {
  MaintenanceReasonChoice,
  MaintenanceReasonPeriodChoice,
  RegularMaintenanceItemChoice,
} from '@template/entities';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import {
  MachineReportResponse,
  MaintenanceReportIrregularMaintenanceItem,
} from '.';

@Entity('maintenance_reports')
export class MaintenanceReport extends BaseEntity {
  @PrimaryColumn({ name: 'machine_report_response_id' })
  machineReportResponseId: string;

  @Column({ name: 'comment' })
  comment: string;

  @Column('decimal', { precision: 8, scale: 1, name: 'service_meter_in_hour' })
  serviceMeterInHour: number;

  @Column({ name: 'work_at' })
  workAt: Date;

  @Column({ name: 'regular_maintenance_item_choice_id' })
  regularMaintenanceItemChoiceId: string;

  @Column({ name: 'maintenance_reason_choice_id' })
  maintenanceReasonChoiceId: string;

  @Column({ name: 'maintenance_reason_period_choice_id' })
  maintenanceReasonPeriodChoiceId: string;

  @OneToOne(
    () => MachineReportResponse,
    (machineReportResponse) => machineReportResponse.maintenanceReport,
  )
  machineReportResponse: MachineReportResponse;

  @OneToMany(
    () => MaintenanceReportIrregularMaintenanceItem,
    (maintenanceReportIrregularMaintenanceItem) =>
      maintenanceReportIrregularMaintenanceItem.maintenanceReport,
  )
  maintenanceReportIrregularMaintenanceItems: MaintenanceReportIrregularMaintenanceItem[];

  @OneToOne(
    () => RegularMaintenanceItemChoice,
    (regularMaintenanceItemChoice) =>
      regularMaintenanceItemChoice.maintenanceReport,
  )
  regularMaintenanceItemChoice: RegularMaintenanceItemChoice;

  @OneToOne(
    () => MaintenanceReasonChoice,
    (maintenanceReasonChoice) => maintenanceReasonChoice.maintenanceReport,
  )
  maintenanceReasonChoice: MaintenanceReasonChoice;

  @OneToOne(
    () => MaintenanceReasonPeriodChoice,
    (maintenanceReasonPeriodChoice) =>
      maintenanceReasonPeriodChoice.maintenanceReport,
  )
  maintenanceReasonPeriodChoice: MaintenanceReasonPeriodChoice;
}
