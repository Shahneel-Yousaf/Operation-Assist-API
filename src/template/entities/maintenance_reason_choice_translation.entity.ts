import { ISOLocaleCode } from '@shared/constants';
import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { MaintenanceReasonChoice } from '.';

@Entity('maintenance_reason_choice_translations')
export class MaintenanceReasonChoiceTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'maintenance_reason_choice_id' })
  maintenanceReasonChoiceId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'maintenance_reason_choice_name' })
  maintenanceReasonChoiceName: string;

  @OneToOne(
    () => MaintenanceReasonChoice,
    (maintenanceReasonChoice) =>
      maintenanceReasonChoice.maintenanceReasonChoiceTranslation,
  )
  maintenanceReasonChoice: MaintenanceReasonChoice;
}
