import {
  UserGroupAssignmentCurrentStatus,
  UserGroupAssignmentHistoryEventType,
} from '@shared/constants';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_group_assignment_histories')
export class UserGroupAssignmentHistory extends BaseEntity {
  @PrimaryColumn({ name: 'user_group_assignment_history_id' })
  userGroupAssignmentHistoryId: string;

  @Column({ name: 'event_type' })
  eventType: UserGroupAssignmentHistoryEventType;

  @Column({ name: 'event_at' })
  eventAt: Date;

  @Column({ name: 'actioned_by_user_id' })
  actionedByUserId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'current_status' })
  currentStatus: UserGroupAssignmentCurrentStatus;

  @Column({ name: 'user_group_role_name' })
  userGroupRoleName: string;

  @Column({ name: 'is_admin' })
  isAdmin: boolean;
}
