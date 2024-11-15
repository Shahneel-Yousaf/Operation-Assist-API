import { ISOLocaleCode } from '@shared/constants';
import { UserGroupAssignment } from '@user/entities';
import { UserGroupRoleTemplate } from '@user-group-role-template/entities/user-group-role-template.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('user_group_role_name_translations')
export class UserGroupRoleNameTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'user_group_role_template_id' })
  userGroupRoleTemplateId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'role_name' })
  roleName: string;

  @ManyToOne(
    () => UserGroupRoleTemplate,
    (userGroupRoleTemplate) =>
      userGroupRoleTemplate.userGroupRoleNameTranslations,
  )
  @JoinColumn({ name: 'user_group_role_template_id' })
  userGroupRoleTemplate: UserGroupRoleTemplate;

  @OneToOne(
    () => UserGroupAssignment,
    (userGroupAssignment) => userGroupAssignment.userGroupRoleNameTranslation,
  )
  @JoinColumn({
    name: 'user_group_role_template_id',
    referencedColumnName: 'userGroupRoleTemplateId',
  })
  userGroupAssignment: UserGroupAssignment;
}
