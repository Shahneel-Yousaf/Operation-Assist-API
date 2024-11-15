import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { FuelMaintenanceReport } from '.';

@Entity('fuel_refills')
export class FuelRefill extends BaseEntity {
  @PrimaryColumn({ name: 'machine_report_response_id' })
  machineReportResponseId: string;

  @Column({ name: 'comment' })
  comment: string;

  @Column('decimal', { precision: 10, scale: 3, name: 'fuel_in_liters' })
  fuelInLiters: number;

  @Column({ name: 'is_adblue_refilled' })
  isAdblueRefilled: boolean;

  @OneToOne(
    () => FuelMaintenanceReport,
    (fuelMaintenanceReport) => fuelMaintenanceReport.fuelRefill,
  )
  @JoinColumn({
    name: 'machine_report_response_id',
  })
  fuelMaintenanceReport: FuelMaintenanceReport;
}
