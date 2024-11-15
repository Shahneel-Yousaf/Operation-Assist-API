import { MaintenanceReportIrregularMaintenanceItem } from '@machine-report/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { IrregularMaintenanceItemChoiceTranslation } from '.';

@Entity('irregular_maintenance_item_choices')
export class IrregularMaintenanceItemChoice extends BaseEntity {
  @PrimaryColumn({ name: 'irregular_maintenance_item_choice_id' })
  irregularMaintenanceItemChoiceId: string;

  @Column({ name: 'irregular_maintenance_item_choice_code' })
  irregularMaintenanceItemChoiceCode: string;

  @Column({ name: 'position' })
  position: number;

  @Column({ name: 'is_disabled' })
  isDisabled: boolean;

  @OneToOne(
    () => IrregularMaintenanceItemChoiceTranslation,
    (irregularMaintenanceItemChoiceTranslation) =>
      irregularMaintenanceItemChoiceTranslation.irregularMaintenanceItemChoice,
  )
  @JoinColumn({
    name: 'irregular_maintenance_item_choice_id',
    referencedColumnName: 'irregularMaintenanceItemChoiceId',
  })
  irregularMaintenanceItemChoiceTranslation: IrregularMaintenanceItemChoiceTranslation;

  @OneToMany(
    () => MaintenanceReportIrregularMaintenanceItem,
    (maintenanceReportIrregularMaintenanceItem) =>
      maintenanceReportIrregularMaintenanceItem.irregularMaintenanceItemChoice,
  )
  maintenanceReportIrregularMaintenanceItems: MaintenanceReportIrregularMaintenanceItem[];
}
