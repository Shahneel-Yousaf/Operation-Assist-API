import { Machine } from '@machine/entities';
import {
  CustomInspectionFormCurrentStatus,
  EventType,
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

import { CustomInspectionForm, CustomInspectionItemHistory } from '.';

@Entity('custom_inspection_form_histories')
export class CustomInspectionFormHistory extends BaseEntity {
  @PrimaryColumn({ name: 'custom_inspection_form_history_id' })
  customInspectionFormHistoryId: string;

  @Column({ name: 'event_type' })
  eventType: EventType;

  @Column({ name: 'event_at' })
  eventAt: Date;

  @Column({ name: 'actioned_by_user_id' })
  actionedByUserId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'machine_id' })
  machineId: string;

  @Column({ name: 'current_status' })
  currentStatus: CustomInspectionFormCurrentStatus;

  @Column({ name: 'custom_inspection_form_id' })
  customInspectionFormId: string;

  @ManyToOne(
    () => CustomInspectionForm,
    (customInspectionForm) =>
      customInspectionForm.customInspectionFormHistories,
  )
  @JoinColumn({ name: 'custom_inspection_form_id' })
  customInspectionForm: CustomInspectionForm;

  @ManyToOne(() => User, (user) => user.customInspectionFormHistories)
  @JoinColumn([{ name: 'actioned_by_user_id' }])
  user: User;

  @ManyToOne(() => Machine, (machine) => machine.customInspectionFormHistories)
  @JoinColumn([{ name: 'machine_id' }])
  machine: Machine;

  @OneToMany(
    () => CustomInspectionItemHistory,
    (customInspectionItemHistory) =>
      customInspectionItemHistory.customInspectionFormHistory,
  )
  customInspectionItemHistories: CustomInspectionItemHistory[];
}
