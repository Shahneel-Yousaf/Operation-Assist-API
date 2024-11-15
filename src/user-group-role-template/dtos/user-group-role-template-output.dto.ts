import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { PermissionTranslateOutput } from '@user/dtos';
import { Expose, Type } from 'class-transformer';

import { UserGroupRoleNameTranslationOutput } from './user-group-role-name-translation-output.dto';

export class UserGroupRoleTemplateOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userGroupRoleTemplateId: string;

  @Expose()
  @ApiProperty()
  roleCode: string;

  @Expose()
  @ApiProperty()
  isAdmin: boolean;

  @Expose()
  @ApiProperty()
  @Type(() => UserGroupRoleNameTranslationOutput)
  userGroupRoleNameTranslation: UserGroupRoleNameTranslationOutput;

  @Expose()
  @ApiProperty({ type: () => [PermissionTranslateOutput] })
  @Type(() => PermissionTranslateOutput)
  permissionTranslates: PermissionTranslateOutput[];
}
