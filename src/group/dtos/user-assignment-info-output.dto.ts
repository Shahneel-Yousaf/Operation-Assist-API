import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { PermissionTranslateOutput } from '@user/dtos';
import { Expose, Type } from 'class-transformer';

export class UserAssignmentInfoOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userId: string;

  @Expose()
  @ApiProperty()
  givenName: string;

  @Expose()
  @ApiProperty()
  surname: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  groupId: string;

  @Expose()
  @ApiProperty()
  roleName: string;

  @Expose()
  @ApiProperty({ type: () => [PermissionTranslateOutput] })
  @Type(() => PermissionTranslateOutput)
  permissions: PermissionTranslateOutput[];

  @Expose()
  @ApiProperty()
  isAdmin: boolean;

  @Expose()
  @ApiProperty()
  userGroupRoleTemplateId: string;
}
