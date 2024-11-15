import { Injectable } from '@nestjs/common';
import { ISOLocaleCode } from '@shared/constants';
import { UserGroupRoleTemplate } from '@user-group-role-template/entities/user-group-role-template.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserGroupRoleTemplateRepository extends Repository<UserGroupRoleTemplate> {
  constructor(private dataSource: DataSource) {
    super(UserGroupRoleTemplate, dataSource.createEntityManager());
  }

  async getRoleTemplateManager(
    isoLocaleCode: ISOLocaleCode,
  ): Promise<UserGroupRoleTemplate> {
    return this.findOne({
      where: {
        isAdmin: true,
        userGroupRoleNameTranslations: {
          isoLocaleCode,
        },
      },
      relations: [
        'userGroupRoleTemplatePermissionAssignments',
        'userGroupRoleNameTranslations',
      ],
    });
  }

  async getTemplateRoles(isoLocaleCode: ISOLocaleCode) {
    return this.createQueryBuilder('userGroupRoleTemplates')
      .innerJoinAndSelect(
        'userGroupRoleTemplates.userGroupRoleNameTranslations',
        'userGroupRoleNameTranslations',
      )
      .leftJoinAndSelect(
        'userGroupRoleTemplates.userGroupRoleTemplatePermissionAssignments',
        'userGroupRoleTemplatePermissionAssignments',
      )
      .leftJoinAndSelect(
        'userGroupRoleTemplatePermissionAssignments.permission',
        'permission',
      )
      .leftJoinAndSelect(
        'permission.permissionTranslations',
        'permissionTranslations',
        'permissionTranslations.isoLocaleCode = :isoLocaleCode',
      )
      .where('userGroupRoleNameTranslations.isoLocaleCode = :isoLocaleCode')
      .setParameters({ isoLocaleCode })
      .getMany();
  }

  async getTemplateRoleManager(
    isoLocaleCode: ISOLocaleCode,
  ): Promise<UserGroupRoleTemplate> {
    return this.createQueryBuilder('userGroupRoleTemplates')
      .innerJoinAndSelect(
        'userGroupRoleTemplates.userGroupRoleNameTranslations',
        'userGroupRoleNameTranslations',
        'userGroupRoleNameTranslations.isoLocaleCode = :isoLocaleCode',
      )
      .leftJoinAndSelect(
        'userGroupRoleTemplates.userGroupRoleTemplatePermissionAssignments',
        'userGroupRoleTemplatePermissionAssignments',
      )
      .where('userGroupRoleTemplates.isAdmin = 1')
      .setParameters({ isoLocaleCode })
      .getOne();
  }

  async getUserAssignmentInfo(
    isoLocaleCode: ISOLocaleCode,
    userId: string,
    groupId: string,
  ) {
    return this.createQueryBuilder('userGroupRoleTemplates')
      .innerJoinAndSelect(
        'userGroupRoleTemplates.userGroupRoleTemplatePermissionAssignments',
        'userGroupRoleTemplatePermissionAssignments',
      )
      .innerJoinAndSelect(
        'userGroupRoleTemplatePermissionAssignments.permission',
        'permission',
      )
      .innerJoinAndSelect(
        'permission.permissionTranslations',
        'permissionTranslations',
        'permissionTranslations.isoLocaleCode = :isoLocaleCode',
      )
      .leftJoinAndSelect(
        'permission.userGroupPermissionAssignments',
        'userGroupPermissionAssignments',
        'userGroupPermissionAssignments.userId = :userId AND userGroupPermissionAssignments.groupId = :groupId',
      )
      .where('userGroupRoleTemplates.isAdmin = 1')
      .setParameters({ isoLocaleCode, userId, groupId })
      .getMany();
  }
}
