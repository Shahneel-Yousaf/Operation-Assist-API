import { ISOLocaleCode } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { RegularMaintenanceItemChoice } from '.';

@Entity('regular_maintenance_item_choice_translations')
export class RegularMaintenanceItemChoiceTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'regular_maintenance_item_choice_id' })
  regularMaintenanceItemChoiceId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'regular_maintenance_item_choice_name' })
  regularMaintenanceItemChoiceName: string;

  @OneToOne(
    () => RegularMaintenanceItemChoice,
    (regularMaintenanceItemChoice) =>
      regularMaintenanceItemChoice.regularMaintenanceItemChoiceTranslation,
  )
  @JoinColumn({
    name: 'regular_maintenance_item_choice_id',
    referencedColumnName: 'regularMaintenanceItemChoiceId',
  })
  regularMaintenanceItemChoice: RegularMaintenanceItemChoice;
}
