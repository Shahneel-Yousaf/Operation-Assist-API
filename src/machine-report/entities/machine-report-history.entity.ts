import { Machine } from '@machine/entities';
import { EventType, MachineReportCurrentStatus } from '@shared/constants';
import { User } from '@user/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { MachineReport } from './machine-report.entity';
import { MachineReportResponse } from './machine-report-response.entity';

@Entity('machine_report_histories')
export class MachineReportHistory extends BaseEntity {
  @PrimaryColumn({ name: 'machine_report_history_id' })
  machineReportHistoryId: string;

  @Column({ name: 'machine_report_id' })
  machineReportId: string;

  @Column({ name: 'event_type' })
  eventType: EventType;

  @Column({ name: 'event_at' })
  eventAt: Date;

  @Column({ name: 'actioned_by_user_id' })
  actionedByUserId: string;

  @Column({ name: 'report_title' })
  reportTitle: string;

  @Column({ name: 'first_machine_report_response_id' })
  firstMachineReportResponseId: string;

  @Column({ name: 'last_machine_report_response_id' })
  lastMachineReportResponseId: string;

  @Column({ name: 'current_status' })
  currentStatus: MachineReportCurrentStatus;

  @Column({ name: 'inspection_result_id' })
  inspectionResultId: string;

  @Column({ name: 'machine_id' })
  machineId: string;

  @ManyToOne(
    () => MachineReport,
    (machineReport) => machineReport.machineReportHistories,
  )
  @JoinColumn([{ name: 'machine_report_id' }])
  machineReport: MachineReport;

  @ManyToOne(() => User, (user) => user.machineReportHistories)
  @JoinColumn([{ name: 'actioned_by_user_id' }])
  user: User;

  @OneToOne(
    () => MachineReportResponse,
    (machineReportResponse) => machineReportResponse.lastMachineReport,
  )
  @JoinColumn({ name: 'last_machine_report_response_id' })
  lastMachineReportResponse: MachineReportResponse;

  @ManyToOne(() => Machine, (machine) => machine.machineReportHistories)
  @JoinColumn([{ name: 'machine_id' }])
  machine: Machine;
}
