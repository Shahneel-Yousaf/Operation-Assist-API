import { Injectable } from '@nestjs/common';
import { ISOLocaleCode } from '@shared/constants';
import { AppLogger } from '@shared/logger/logger.service';
import { UserGroupRoleTemplateOutput } from '@user-group-role-template/dtos';
import { UserGroupRoleTemplateRepository } from '@user-group-role-template/repositories/user-group-role-template.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserGroupRoleTemplateService {
  constructor(
    private readonly logger: AppLogger,
    private readonly userGroupRoleTemplateRepository: UserGroupRoleTemplateRepository,
  ) {
    this.logger.setContext(UserGroupRoleTemplateService.name);
  }

  async getTemplateRoles(
    isoLocaleCode: ISOLocaleCode,
  ): Promise<UserGroupRoleTemplateOutput[]> {
    const templateRoles =
      await this.userGroupRoleTemplateRepository.getTemplateRoles(
        isoLocaleCode,
      );

    const adminPermissions = templateRoles.find(
      (templateRoles) => templateRoles.isAdmin,
    );

    const response = templateRoles.map((templateRole) => {
      const permissions =
        templateRole.userGroupRoleTemplatePermissionAssignments.map(
          (permission) => permission.permissionId,
        );

      return {
        ...templateRole,
        userGroupRoleNameTranslation:
          templateRole.userGroupRoleNameTranslations[0],
        permissionTranslates:
          adminPermissions.userGroupRoleTemplatePermissionAssignments.map(
            (adminPermissions) => ({
              ...adminPermissions.permission.permissionTranslations[0],
              isChecked: permissions.includes(adminPermissions.permissionId),
            }),
          ),
      };
    });

    return plainToInstance(UserGroupRoleTemplateOutput, response);
  }
}
