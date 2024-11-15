import { EventType } from '@shared/constants';
import { User } from '@user/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { InspectionHistory } from '.';

@Entity('inspection_result_histories')
export class InspectionResultHistory extends BaseEntity {
  @PrimaryColumn({ name: 'inspection_result_history_id' })
  inspectionResultHistoryId: string;

  @Column({ name: 'event_type' })
  eventType: EventType;

  @Column({ name: 'event_at' })
  eventAt: Date;

  @Column({ name: 'actioned_by_user_id' })
  actionedByUserId: string;

  @Column({ name: 'inspection_result_id' })
  inspectionResultId: string;

  @Column({ name: 'result' })
  result: string;

  @Column({ name: 'inspection_history_id' })
  inspectionHistoryId: string;

  @Column({ name: 'custom_inspection_item_id' })
  customInspectionItemId: string;

  @Column({ name: 'current_status' })
  currentStatus: string;

  @Column({ name: 'item_code' })
  itemCode: string;

  @ManyToOne(() => User, (user) => user.inspectionResultHistories)
  @JoinColumn([{ name: 'actioned_by_user_id' }])
  user: User;

  @ManyToOne(
    () => InspectionHistory,
    (inspectionHistory) => inspectionHistory.inspectionResultHistories,
  )
  @JoinColumn([{ name: 'inspection_history_id' }])
  inspectionHistory: InspectionHistory;
}
