import { MachineReportResponse } from '@machine-report/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { ReportActionChoice } from '.';

@Entity('report_actions')
export class ReportAction extends BaseEntity {
  @PrimaryColumn({ name: 'report_action_choice_id' })
  reportActionChoiceId: string;

  @PrimaryColumn({ name: 'machine_report_response_id' })
  machineReportResponseId: string;

  @Column({ name: 'action_at' })
  actionAt: Date;

  @ManyToOne(
    () => MachineReportResponse,
    (machineReportResponse) => machineReportResponse.reportActions,
  )
  @JoinColumn({ name: 'machine_report_response_id' })
  machineReportResponse: MachineReportResponse;

  @ManyToOne(
    () => ReportActionChoice,
    (reportActionChoice) => reportActionChoice.reportActions,
  )
  @JoinColumn({ name: 'report_action_choice_id' })
  reportActionChoice: ReportActionChoice;
}
