import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import {
  FuelRefill,
  MachineReportResponse,
  OilCoolantRefillExchange,
  PartReplacement,
} from '.';

@Entity('fuel_maintenance_reports')
export class FuelMaintenanceReport extends BaseEntity {
  @PrimaryColumn({ name: 'machine_report_response_id' })
  machineReportResponseId: string;

  @Column({ name: 'work_at' })
  workAt: Date;

  @Column('decimal', { precision: 8, scale: 1, name: 'service_meter_in_hour' })
  serviceMeterInHour: number;

  @OneToOne(
    () => MachineReportResponse,
    (machineReportResponse) => machineReportResponse.fuelMaintenanceReport,
  )
  machineReportResponse: MachineReportResponse;

  @OneToOne(() => FuelRefill, (fuelRefill) => fuelRefill.fuelMaintenanceReport)
  fuelRefill: FuelRefill;

  @OneToMany(
    () => OilCoolantRefillExchange,
    (oilCoolantRefillExchange) =>
      oilCoolantRefillExchange.fuelMaintenanceReport,
  )
  oilCoolantRefillExchanges: OilCoolantRefillExchange[];

  @OneToMany(
    () => PartReplacement,
    (partReplacement) => partReplacement.fuelMaintenanceReport,
  )
  partReplacements: PartReplacement[];
}
