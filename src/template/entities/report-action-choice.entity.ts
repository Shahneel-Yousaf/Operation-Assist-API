import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { ReportAction, ReportActionChoiceTranslation } from '.';

@Entity('report_action_choices')
export class ReportActionChoice extends BaseEntity {
  @PrimaryColumn({ name: 'report_action_choice_id' })
  reportActionChoiceId: string;

  @Column({ name: 'report_action_choice_code' })
  reportActionChoiceCode: string;

  @OneToOne(
    () => ReportActionChoiceTranslation,
    (reportActionChoiceTranslation) =>
      reportActionChoiceTranslation.reportActionChoice,
  )
  @JoinColumn({
    name: 'report_action_choice_id',
    referencedColumnName: 'reportActionChoiceId',
  })
  reportActionChoiceTranslation: ReportActionChoiceTranslation;

  @OneToMany(
    () => ReportAction,
    (reportAction) => reportAction.reportActionChoice,
  )
  reportActions: ReportAction[];
}
