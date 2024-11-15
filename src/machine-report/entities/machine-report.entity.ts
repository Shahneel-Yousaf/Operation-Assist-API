import { InspectionResult } from '@inspection/entities';
import { Machine } from '@machine/entities';
import { MachineReportCurrentStatus } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import {
  MachineReportHistory,
  MachineReportResponse,
  MachineReportUserRead,
} from '.';

@Entity('machine_reports')
export class MachineReport extends BaseEntity {
  @PrimaryColumn({ name: 'machine_report_id' })
  machineReportId: string;

  @Column({ name: 'report_title' })
  reportTitle: string;

  @Column({ name: 'last_status_updated_at' })
  lastStatusUpdatedAt: Date;

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

  @ManyToOne(() => Machine, (machine) => machine.machineReports)
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;

  @OneToMany(
    () => MachineReportResponse,
    (machineReportResponse) => machineReportResponse.machineReport,
  )
  machineReportResponses: MachineReportResponse[];

  @OneToMany(
    () => MachineReportUserRead,
    (machineReportUserRead) => machineReportUserRead.machineReport,
  )
  machineReportUserReads: MachineReportUserRead[];

  @OneToMany(
    () => MachineReportHistory,
    (machineReportHistory) => machineReportHistory.machineReport,
  )
  machineReportHistories: MachineReportHistory[];

  @OneToOne(
    () => MachineReportResponse,
    (machineReportResponse) => machineReportResponse.firstMachineReport,
  )
  @JoinColumn({ name: 'first_machine_report_response_id' })
  firstMachineReportResponse: MachineReportResponse;

  @OneToOne(
    () => MachineReportResponse,
    (machineReportResponse) => machineReportResponse.lastMachineReport,
  )
  @JoinColumn({ name: 'last_machine_report_response_id' })
  lastMachineReportResponse: MachineReportResponse;

  @OneToOne(
    () => InspectionResult,
    (inspectionResult) => inspectionResult.machineReport,
  )
  @JoinColumn({ name: 'inspection_result_id' })
  inspectionResult: InspectionResult;

  @OneToOne(
    () => MachineReportUserRead,
    (machineReportUserRead) => machineReportUserRead.machineReportUser,
  )
  machineReportUserRead: MachineReportUserRead;
}
