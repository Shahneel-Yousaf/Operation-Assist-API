import { UserGroupPermissionAssignment } from '@user/entities';
import { UserGroupRoleTemplatePermissionAssignment } from '@user-group-role-template/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { Operation } from './operation.entity';
import { PermissionTranslation } from './permission-translate.entity';
import { Resource } from './resource.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @PrimaryColumn({ name: 'permission_id' })
  permissionId: string;

  @Column({ name: 'resource_id' })
  resourceId: string;

  @Column({ name: 'operation_id' })
  operationId: string;

  @OneToMany(
    () => UserGroupPermissionAssignment,
    (userGroupPermissionAssignment) => userGroupPermissionAssignment.permission,
  )
  userGroupPermissionAssignments: UserGroupPermissionAssignment[];

  @OneToMany(
    () => UserGroupRoleTemplatePermissionAssignment,
    (userGroupRoleTemplatePermissionAssignment) =>
      userGroupRoleTemplatePermissionAssignment.permission,
  )
  userGroupRoleTemplatePermissionAssignments: UserGroupRoleTemplatePermissionAssignment[];

  @OneToMany(
    () => PermissionTranslation,
    (permissionTranslation) => permissionTranslation.permission,
  )
  permissionTranslations: PermissionTranslation[];

  @ManyToOne(() => Operation, (operation) => operation.permissions)
  @JoinColumn({ name: 'operation_id' })
  operation: Operation;

  @ManyToOne(() => Resource, (resource) => resource.permissions)
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;
}
