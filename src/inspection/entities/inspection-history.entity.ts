import {
  DevicePlatform,
  EventType,
  InspectionCurrentStatus,
} from '@shared/constants';
import { User } from '@user/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { CustomInspectionForm, Inspection, InspectionResultHistory } from '.';

@Entity('inspection_histories')
export class InspectionHistory extends BaseEntity {
  @PrimaryColumn({ name: 'inspection_history_id' })
  inspectionHistoryId: string;

  @Column({ name: 'event_type' })
  eventType: EventType;

  @Column({ name: 'actioned_by_user_id' })
  actionedByUserId: string;

  @Column({ name: 'event_at' })
  eventAt: Date;

  @Column({ name: 'inspection_id' })
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

  @Column({ name: 'current_status' })
  currentStatus: InspectionCurrentStatus;

  @Column({ name: 'device_platform' })
  devicePlatform: DevicePlatform;

  @ManyToOne(() => Inspection, (inspection) => inspection.inspectionHistories)
  @JoinColumn({ name: 'inspection_id' })
  inspection: Inspection;

  @Column({ name: 'custom_inspection_form_id' })
  customInspectionFormId: string;

  @ManyToOne(() => User, (user) => user.inspectionHistories)
  @JoinColumn([{ name: 'actioned_by_user_id' }])
  user: User;

  @ManyToOne(
    () => CustomInspectionForm,
    (customInspectionForm) => customInspectionForm.inspectionHistories,
  )
  @JoinColumn([{ name: 'custom_inspection_form_id' }])
  customInspectionForm: CustomInspectionForm;

  @OneToMany(
    () => InspectionResultHistory,
    (inspectionResultHistory) => inspectionResultHistory.inspectionHistory,
  )
  inspectionResultHistories: InspectionResultHistory[];
}
