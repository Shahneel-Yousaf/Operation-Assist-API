import { MaintenanceReport } from '@machine-report/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { RegularMaintenanceItemChoiceTranslation } from '.';

@Entity('regular_maintenance_item_choices')
export class RegularMaintenanceItemChoice extends BaseEntity {
  @PrimaryColumn({ name: 'regular_maintenance_item_choice_id' })
  regularMaintenanceItemChoiceId: string;

  @Column({ name: 'regular_maintenance_item_choice_code' })
  regularMaintenanceItemChoiceCode: string;

  @Column({ name: 'position' })
  position: number;

  @Column({ name: 'is_disabled' })
  isDisabled: boolean;

  @OneToOne(
    () => RegularMaintenanceItemChoiceTranslation,
    (regularMaintenanceItemChoiceTranslation) =>
      regularMaintenanceItemChoiceTranslation.regularMaintenanceItemChoice,
  )
  regularMaintenanceItemChoiceTranslation: RegularMaintenanceItemChoiceTranslation;

  @OneToOne(
    () => MaintenanceReport,
    (maintenanceReport) => maintenanceReport.regularMaintenanceItemChoice,
  )
  @JoinColumn({
    name: 'regular_maintenance_item_choice_id',
    referencedColumnName: 'regularMaintenanceItemChoiceId',
  })
  maintenanceReport: MaintenanceReport;
}
