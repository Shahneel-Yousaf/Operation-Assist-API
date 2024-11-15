import { ActionType } from '@shared/constants';
import { OilType } from '@template/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { FuelMaintenanceReport } from '.';

@Entity('oil_coolant_refill_exchanges')
export class OilCoolantRefillExchange extends BaseEntity {
  @PrimaryColumn({ name: 'oil_coolant_refill_exchange_id' })
  oilCoolantRefillExchangeId: string;

  @Column({ name: 'machine_report_response_id' })
  machineReportResponseId: string;

  @Column({ name: 'oil_type_id' })
  oilTypeId: string;

  @Column({ name: 'action_type' })
  actionType: ActionType;

  @Column('decimal', { precision: 10, scale: 3, name: 'fluid_in_liters' })
  fluidInLiters: number;

  @Column({ name: 'comment' })
  comment: string;

  @ManyToOne(
    () => FuelMaintenanceReport,
    (fuelMaintenanceReport) => fuelMaintenanceReport.oilCoolantRefillExchanges,
  )
  @JoinColumn([{ name: 'machine_report_response_id' }])
  fuelMaintenanceReport: FuelMaintenanceReport;

  @ManyToOne(() => OilType, (oilType) => oilType.oilCoolantRefillExchanges)
  @JoinColumn([{ name: 'oil_type_id' }])
  oilType: OilType;
}
