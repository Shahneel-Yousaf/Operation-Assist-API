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

import { MachineReport } from '.';

@Entity('machine_report_user_reads')
export class MachineReportUserRead extends BaseEntity {
  @PrimaryColumn({ name: 'machine_report_id' })
  machineReportId: string;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'read_at' })
  readAt: Date;

  @ManyToOne(
    () => MachineReport,
    (machineReport) => machineReport.machineReportUserReads,
  )
  @JoinColumn({ name: 'machine_report_id' })
  machineReport: MachineReport;

  @ManyToOne(() => User, (user) => user.machineReportUserReads)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(
    () => MachineReport,
    (machineReport) => machineReport.machineReportUserRead,
  )
  @JoinColumn({ name: 'machine_report_id' })
  machineReportUser: MachineReport;
}
