import { EventType, MachineCurrentStatus } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { Machine } from './machine.entity';

@Entity('machine_histories')
export class MachineHistory extends BaseEntity {
  @PrimaryColumn({ name: 'machine_history_id' })
  machineHistoryId: string;

  @Column({ name: 'event_type' })
  eventType: EventType;

  @Column({ name: 'customer_machine_name' })
  machineName: string;

  @Column({ name: 'event_at' })
  eventAt: Date;

  @Column({ name: 'actioned_by_user_id' })
  actionedByUserId: string;

  @Column({ name: 'machine_id' })
  machineId: string;

  @Column({ name: 'serial_number_plate_picture_url' })
  serialNumberPlatePictureUrl: string;

  @Column({ name: 'machine_type_id' })
  machineTypeId: string;

  @Column({ name: 'picture_url' })
  pictureUrl: string;

  @Column({ name: 'machine_manufacturer_id' })
  machineManufacturerId: string;

  @Column({ name: 'model_and_type' })
  modelAndType: string;

  @Column({ name: 'serial_number' })
  serialNumber: string;

  @Column({ name: 'current_status' })
  currentStatus: MachineCurrentStatus;

  @Column({ name: 'custom_machine_manufacturer_name' })
  customMachineManufacturerName: string;

  @Column({ name: 'custom_type_name' })
  customTypeName: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => Machine, (machine) => machine.machineHistories)
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;
}
