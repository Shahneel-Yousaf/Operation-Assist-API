import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_REGEX,
} from '@shared/constants';
import { TrimString } from '@shared/decorators';
import {
  IsArrayUnique,
  RegexMatches,
  RegexNotMatches,
} from '@shared/validations';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserGroupAssignmentUpdateInput {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;

  @ApiProperty()
  @TrimString()
  @IsString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @Length(0, 255)
  userGroupRoleName: string;

  @ApiProperty(defaultExamples.permissionIds)
  @IsArrayUnique()
  @Length(26, 26, { each: true })
  @IsString({ each: true })
  @IsArray()
  permissionIds: string[];

  @ApiProperty(defaultExamples.entityId)
  @Length(26, 26)
  @IsString()
  userGroupRoleTemplateId: string;
}
