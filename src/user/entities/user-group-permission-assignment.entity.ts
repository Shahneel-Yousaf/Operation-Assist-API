import { Permission } from '@user-group-role-template/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { UserGroupAssignment } from './user-group-assignment.entity';

@Entity('user_group_permission_assignments')
export class UserGroupPermissionAssignment extends BaseEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'group_id' })
  groupId: string;

  @PrimaryColumn({ name: 'permission_id' })
  permissionId: string;

  @Column({ name: 'assigned_at' })
  assignedAt: Date;

  @ManyToOne(
    () => UserGroupAssignment,
    (user) => user.userGroupPermissionAssignments,
  )
  @JoinColumn([
    { name: 'user_id', referencedColumnName: 'userId' },
    { name: 'group_id', referencedColumnName: 'groupId' },
  ])
  userGroupAssignment: UserGroupAssignment;

  @ManyToOne(
    () => Permission,
    (permission) => permission.userGroupPermissionAssignments,
  )
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
