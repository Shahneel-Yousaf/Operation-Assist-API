import { ISOLocaleCode } from '@shared/constants';
import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { IrregularMaintenanceItemChoice } from '.';

@Entity('irregular_maintenance_item_choice_translations')
export class IrregularMaintenanceItemChoiceTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'irregular_maintenance_item_choice_id' })
  irregularMaintenanceItemChoiceId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'irregular_maintenance_item_choice_name' })
  irregularMaintenanceItemChoiceName: string;

  @OneToOne(
    () => IrregularMaintenanceItemChoice,
    (irregularMaintenanceItemChoice) =>
      irregularMaintenanceItemChoice.irregularMaintenanceItemChoiceTranslation,
  )
  irregularMaintenanceItemChoice: IrregularMaintenanceItemChoice;
}
