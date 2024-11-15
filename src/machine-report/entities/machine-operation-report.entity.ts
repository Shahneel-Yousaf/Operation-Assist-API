import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { MachineReportResponse } from '.';

@Entity('machine_operation_reports')
export class MachineOperationReport extends BaseEntity {
  @PrimaryColumn({ name: 'machine_report_response_id' })
  machineReportResponseId: string;

  @Column({ name: 'start_at' })
  startAt: Date;

  @Column({ name: 'end_at' })
  endAt: Date;

  @Column({ name: 'operation_details' })
  operationDetail: string;

  @Column({ name: 'comment' })
  comment: string;

  @OneToOne(
    () => MachineReportResponse,
    (machineReportResponse) => machineReportResponse.machineOperationReport,
  )
  machineReportResponse: MachineReportResponse;
}
