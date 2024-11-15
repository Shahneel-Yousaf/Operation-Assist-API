import { ISOLocaleCode } from '@shared/constants';
import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { MaintenanceReasonPeriodChoice } from '.';

@Entity('maintenance_reason_period_choice_translations')
export class MaintenanceReasonPeriodChoiceTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'maintenance_reason_period_choice_id' })
  maintenanceReasonPeriodChoiceId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'maintenance_reason_period_choice_name' })
  maintenanceReasonPeriodChoiceName: string;

  @OneToOne(
    () => MaintenanceReasonPeriodChoice,
    (maintenanceReasonPeriodChoice) =>
      maintenanceReasonPeriodChoice.maintenanceReasonPeriodChoiceTranslation,
  )
  maintenanceReasonPeriodChoice: MaintenanceReasonPeriodChoice;
}
