import { MaintenanceReport } from '@machine-report/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { MaintenanceReasonPeriodChoiceTranslation } from '.';

@Entity('maintenance_reason_period_choices')
export class MaintenanceReasonPeriodChoice extends BaseEntity {
  @PrimaryColumn({ name: 'maintenance_reason_period_choice_id' })
  maintenanceReasonPeriodChoiceId: string;

  @Column({ name: 'maintenance_reason_period_choice_code' })
  maintenanceReasonPeriodChoiceCode: string;

  @Column({ name: 'position' })
  position: number;

  @OneToOne(
    () => MaintenanceReasonPeriodChoiceTranslation,
    (maintenanceReasonPeriodChoiceTranslation) =>
      maintenanceReasonPeriodChoiceTranslation.maintenanceReasonPeriodChoice,
  )
  @JoinColumn({
    name: 'maintenance_reason_period_choice_id',
    referencedColumnName: 'maintenanceReasonPeriodChoiceId',
  })
  maintenanceReasonPeriodChoiceTranslation: MaintenanceReasonPeriodChoiceTranslation;

  @OneToOne(
    () => MaintenanceReport,
    (maintenanceReport) => maintenanceReport.maintenanceReasonPeriodChoice,
  )
  @JoinColumn({
    name: 'maintenance_reason_period_choice_id',
    referencedColumnName: 'maintenanceReasonPeriodChoiceId',
  })
  maintenanceReport: MaintenanceReport;
}
