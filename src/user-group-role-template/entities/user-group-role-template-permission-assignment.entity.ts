import { Permission } from '@user-group-role-template/entities/permission.entity';
import { UserGroupRoleTemplate } from '@user-group-role-template/entities/user-group-role-template.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('user_group_role_template_permission_assignments')
export class UserGroupRoleTemplatePermissionAssignment extends BaseEntity {
  @PrimaryColumn({ name: 'permission_id' })
  permissionId: string;

  @Column({ name: 'user_group_role_template_id' })
  userGroupRoleTemplateId: string;

  @Column({ name: 'assigned_at' })
  assignedAt: Date;

  @ManyToOne(
    () => Permission,
    (permission) => permission.userGroupRoleTemplatePermissionAssignments,
  )
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @ManyToOne(
    () => UserGroupRoleTemplate,
    (userGroupRoleTemplate) =>
      userGroupRoleTemplate.userGroupRoleTemplatePermissionAssignments,
  )
  @JoinColumn({ name: 'user_group_role_template_id' })
  userGroupRoleTemplate: UserGroupRoleTemplate;
}
