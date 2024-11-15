import {
  CustomInspectionFormCurrentStatus,
  CustomInspectionItemResultType,
  EventType,
} from '@shared/constants';
import { User } from '@user/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { CustomInspectionFormHistory, CustomInspectionItem } from '.';

@Entity('custom_inspection_item_histories')
export class CustomInspectionItemHistory extends BaseEntity {
  @PrimaryColumn({ name: 'custom_inspection_item_history_id' })
  customInspectionItemHistoryId: string;

  @Column({ name: 'custom_inspection_item_id' })
  customInspectionItemId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'actioned_by_user_id' })
  actionedByUserId: string;

  @Column({ name: 'event_type' })
  eventType: EventType;

  @Column({ name: 'event_at' })
  eventAt: Date;

  @Column({ name: 'result_type' })
  resultType: CustomInspectionItemResultType;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'is_required' })
  isRequired: boolean;

  @Column({ name: 'is_forced_required' })
  isForcedRequired: boolean;

  @Column({ name: 'is_immutable' })
  isImmutable: boolean;

  @Column({ name: 'position' })
  position: number;

  @Column({ name: 'current_status' })
  currentStatus: CustomInspectionFormCurrentStatus;

  @Column({ name: 'custom_inspection_form_history_id' })
  customInspectionFormHistoryId: string;

  @Column({ name: 'item_code' })
  itemCode: string;

  @ManyToOne(() => User, (user) => user.customInspectionItemHistories)
  @JoinColumn([{ name: 'actioned_by_user_id' }])
  user: User;

  @ManyToOne(
    () => CustomInspectionFormHistory,
    (customInspectionFormHistory) =>
      customInspectionFormHistory.customInspectionItemHistories,
  )
  @JoinColumn([{ name: 'custom_inspection_form_history_id' }])
  customInspectionFormHistory: CustomInspectionFormHistory;

  @ManyToOne(
    () => CustomInspectionItem,
    (customInspectionItem) =>
      customInspectionItem.customInspectionItemHistories,
  )
  @JoinColumn([{ name: 'custom_inspection_item_id' }])
  customInspectionItem: CustomInspectionItem;
}
