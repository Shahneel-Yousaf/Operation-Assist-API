import { GroupCurrentStatus, GroupHistoryEventType } from '@shared/constants';
import { User } from '@user/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { Group } from './group.entity';

@Entity('group_histories')
export class GroupHistory extends BaseEntity {
  @PrimaryColumn({ name: 'group_history_id' })
  groupHistoryId: string;

  @Column({ name: 'event_type' })
  eventType: GroupHistoryEventType;

  @Column({ name: 'event_at' })
  eventAt: Date;

  @Column({ name: 'actioned_by_user_id' })
  actionedByUserId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'group_name' })
  groupName: string;

  @Column({ name: 'location' })
  location: string;

  @Column({ name: 'current_status' })
  currentStatus: GroupCurrentStatus;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'allow_non_komatsu_info_use' })
  allowNonKomatsuInfoUse: boolean;

  @ManyToOne(() => User, (user) => user.groupHistories)
  @JoinColumn({ name: 'actioned_by_user_id' })
  user: User;

  @ManyToOne(() => Group, (group) => group.groupHistories)
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
