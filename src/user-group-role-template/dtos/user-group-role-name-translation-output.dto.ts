import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, ISOLocaleCode } from '@shared/constants';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class UserGroupRoleNameTranslationOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userGroupRoleTemplateId: string;

  @Expose()
  @ApiProperty(defaultExamples.localeCode)
  @IsEnum(ISOLocaleCode)
  isoLocaleCode: ISOLocaleCode;

  @Expose()
  @ApiProperty()
  roleName: string;
}
