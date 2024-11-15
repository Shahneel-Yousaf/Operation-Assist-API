import { MachineReportResponseStatus, Subtype } from '@shared/constants';
import { ReportAction } from '@template/entities';
import { User } from '@user/entities';
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
  FuelMaintenanceReport,
  MachineOperationReport,
  MachineReport,
  MachineReportHistory,
  MachineReportMedia,
  MaintenanceReport,
} from '.';

@Entity('machine_report_responses')
export class MachineReportResponse extends BaseEntity {
  @PrimaryColumn({ name: 'machine_report_response_id' })
  machineReportResponseId: string;

  @Column({ name: 'report_comment' })
  reportComment: string;

  @Column({ name: 'responsed_at' })
  commentedAt: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'status' })
  status: MachineReportResponseStatus;

  @Column('decimal', { precision: 10, scale: 7, name: 'lat' })
  lat: number;

  @Column('decimal', { precision: 10, scale: 7, name: 'lng' })
  lng: number;

  @Column({ name: 'machine_report_id' })
  machineReportId: string;

  @Column({ name: 'location_accuracy' })
  locationAccuracy: string;

  @Column({ name: 'device_platform' })
  devicePlatform: string;

  @Column({ name: 'subtype' })
  subtype: Subtype;

  @Column('decimal', { precision: 8, scale: 1, name: 'service_meter_in_hour' })
  serviceMeterInHour: number;

  @ManyToOne(() => User, (user) => user.machineReportResponses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    () => MachineReport,
    (machineReport) => machineReport.machineReportResponses,
  )
  @JoinColumn({ name: 'machine_report_id' })
  machineReport: MachineReport;

  @OneToMany(
    () => MachineReportMedia,
    (machineReportMedia) => machineReportMedia.machineReportResponse,
  )
  machineReportMedias: MachineReportMedia[];

  @OneToMany(
    () => ReportAction,
    (reportAction) => reportAction.machineReportResponse,
  )
  reportActions: ReportAction[];

  @OneToOne(
    () => MachineReport,
    (machineReport) => machineReport.firstMachineReportResponse,
  )
  firstMachineReport: MachineReport;

  @OneToOne(
    () => MachineReport,
    (machineReport) => machineReport.lastMachineReportResponse,
  )
  lastMachineReport: MachineReport;

  @OneToOne(
    () => MachineReportHistory,
    (machineReportHistory) => machineReportHistory.lastMachineReportResponse,
  )
  lastMachineReportHistory: MachineReportHistory;

  @OneToOne(
    () => MachineOperationReport,
    (machineOperationReport) => machineOperationReport.machineReportResponse,
  )
  @JoinColumn({ name: 'machine_report_response_id' })
  machineOperationReport: MachineOperationReport;

  @OneToOne(
    () => FuelMaintenanceReport,
    (fuelMaintenanceReport) => fuelMaintenanceReport.machineReportResponse,
  )
  @JoinColumn({ name: 'machine_report_response_id' })
  fuelMaintenanceReport: FuelMaintenanceReport;

  @OneToOne(
    () => MaintenanceReport,
    (maintenanceReport) => maintenanceReport.machineReportResponse,
  )
  @JoinColumn({ name: 'machine_report_response_id' })
  maintenanceReport: MaintenanceReport;
}
