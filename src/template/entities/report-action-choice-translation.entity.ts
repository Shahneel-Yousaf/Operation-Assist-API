import { ISOLocaleCode } from '@shared/constants';
import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { ReportActionChoice } from '.';

@Entity('report_action_choice_translations')
export class ReportActionChoiceTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'report_action_choice_id' })
  reportActionChoiceId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'report_action_choice_name' })
  reportActionChoiceName: string;

  @OneToOne(
    () => ReportActionChoice,
    (reportActionChoice) => reportActionChoice.reportActionChoiceTranslation,
  )
  reportActionChoice: ReportActionChoice;
}
