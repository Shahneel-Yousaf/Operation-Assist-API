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

export class GroupInviteUserInput {
  @ApiPropertyOptional({
    ...defaultExamples.entityId,
    description: 'The user ID who was invited',
  })
  @Length(26, 26)
  @IsString()
  @IsOptional()
  inviteeUserId: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;

  @ApiProperty()
  @TrimString()
  @Length(0, 255)
  @IsString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  userGroupRoleName: string;

  @ApiPropertyOptional(defaultExamples.permissionIds)
  @IsArrayUnique()
  @Length(26, 26, { each: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  permissionIds: string[];

  @ApiProperty(defaultExamples.entityId)
  @Length(26, 26)
  @IsString()
  userGroupRoleTemplateId: string;
}
