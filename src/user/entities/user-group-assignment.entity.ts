import { Group } from '@group/entities';
import { UserGroupAssignmentCurrentStatus } from '@shared/constants';
import { UserGroupRoleNameTranslation } from '@user-group-role-template/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from './user.entity';
import { UserGroupPermissionAssignment } from './user-group-permission-assignment.entity';

@Entity('user_group_assignments')
export class UserGroupAssignment extends BaseEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'last_status_updated_at' })
  lastStatusUpdatedAt: Date;

  @Column({ name: 'current_status' })
  currentStatus: UserGroupAssignmentCurrentStatus;

  @Column({ name: 'user_group_role_name' })
  userGroupRoleName: string;

  @Column({ name: 'is_admin' })
  isAdmin: boolean;

  @Column({ name: 'user_group_role_template_id' })
  userGroupRoleTemplateId: string;

  @OneToMany(
    () => UserGroupPermissionAssignment,
    (userGroupPermissionAssignment) =>
      userGroupPermissionAssignment.userGroupAssignment,
  )
  userGroupPermissionAssignments: UserGroupPermissionAssignment[];

  @ManyToOne(() => User, (user) => user.userGroupAssignments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroupAssignments)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToOne(
    () => UserGroupRoleNameTranslation,
    (userGroupRoleNameTranslation) =>
      userGroupRoleNameTranslation.userGroupAssignment,
  )
  userGroupRoleNameTranslation: UserGroupRoleNameTranslation;
}
