import { UserGroupRoleNameTranslation } from '@user-group-role-template/entities/user-group-role-name-translation.entity';
import { UserGroupRoleTemplatePermissionAssignment } from '@user-group-role-template/entities/user-group-role-template-permission-assignment.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('user_group_role_templates')
export class UserGroupRoleTemplate extends BaseEntity {
  @PrimaryColumn({ name: 'user_group_role_template_id' })
  userGroupRoleTemplateId: string;

  @Column({ name: 'role_code' })
  roleCode: string;

  @Column({ name: 'is_admin' })
  isAdmin: boolean;

  @OneToMany(
    () => UserGroupRoleNameTranslation,
    (userGroupRoleNameTranslation) =>
      userGroupRoleNameTranslation.userGroupRoleTemplate,
  )
  userGroupRoleNameTranslations: UserGroupRoleNameTranslation[];

  @OneToMany(
    () => UserGroupRoleTemplatePermissionAssignment,
    (userGroupRoleTemplatePermissionAssignment) =>
      userGroupRoleTemplatePermissionAssignment.userGroupRoleTemplate,
  )
  userGroupRoleTemplatePermissionAssignments: UserGroupRoleTemplatePermissionAssignment[];
}
