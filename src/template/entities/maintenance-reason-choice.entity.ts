import { MaintenanceReport } from '@machine-report/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { MaintenanceReasonChoiceTranslation } from '.';

@Entity('maintenance_reason_choices')
export class MaintenanceReasonChoice extends BaseEntity {
  @PrimaryColumn({ name: 'maintenance_reason_choice_id' })
  maintenanceReasonChoiceId: string;

  @Column({ name: 'maintenance_reason_choice_code' })
  maintenanceReasonChoiceCode: string;

  @Column({ name: 'position' })
  position: number;

  @OneToOne(
    () => MaintenanceReasonChoiceTranslation,
    (maintenanceReasonChoiceTranslation) =>
      maintenanceReasonChoiceTranslation.maintenanceReasonChoice,
  )
  @JoinColumn({
    name: 'maintenance_reason_choice_id',
    referencedColumnName: 'maintenanceReasonChoiceId',
  })
  maintenanceReasonChoiceTranslation: MaintenanceReasonChoiceTranslation;

  @OneToOne(
    () => MaintenanceReport,
    (maintenanceReport) => maintenanceReport.maintenanceReasonChoice,
  )
  @JoinColumn({
    name: 'maintenance_reason_choice_id',
    referencedColumnName: 'maintenanceReasonChoiceId',
  })
  maintenanceReport: MaintenanceReport;
}
