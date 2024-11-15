import { Machine } from '@machine/entities';
import { DevicePlatform, InspectionCurrentStatus } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { CustomInspectionForm, InspectionHistory, InspectionResult } from '.';

@Entity('inspections')
export class Inspection extends BaseEntity {
  @PrimaryColumn({ name: 'inspection_id' })
  inspectionId: string;

  @Column({ name: 'inspection_at' })
  inspectionAt: Date;

  @Column({ name: 'machine_id' })
  machineId: string;

  @Column('decimal', { precision: 10, scale: 7, name: 'lat' })
  lat: number;

  @Column('decimal', { precision: 10, scale: 7, name: 'lng' })
  lng: number;

  @Column({ name: 'location_accuracy' })
  locationAccuracy: string;

  @Column({ name: 'device_platform' })
  devicePlatform: DevicePlatform;

  @Column({ name: 'current_status' })
  currentStatus: InspectionCurrentStatus;

  @Column({ name: 'last_status_updated_at' })
  lastStatusUpdatedAt: Date;

  @Column({ name: 'custom_inspection_form_id' })
  customInspectionFormId: string;

  @ManyToOne(() => Machine, (machine) => machine.inspections)
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;

  @ManyToOne(
    () => CustomInspectionForm,
    (customInspectionForm) => customInspectionForm.inspections,
  )
  @JoinColumn({ name: 'custom_inspection_form_id' })
  customInspectionForm: CustomInspectionForm;

  @OneToMany(
    () => InspectionHistory,
    (inspectionHistory) => inspectionHistory.inspection,
  )
  inspectionHistories: InspectionHistory[];

  @OneToMany(
    () => InspectionResult,
    (inspectionResult) => inspectionResult.inspection,
  )
  inspectionResults: InspectionResult[];
}
