import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_REGEX,
} from '@shared/constants';
import { TrimString } from '@shared/decorators';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import { IsBoolean, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateGroupInput {
  @ApiProperty()
  @TrimString()
  @IsNotEmpty()
  @Length(1, 255)
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  groupName: string;

  @ApiPropertyOptional()
  @TrimString()
  @Length(0, 255)
  @IsOptional()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  companyName: string;

  @ApiPropertyOptional(defaultExamples.createGroupInput.allowNonKomatsuInfoUse)
  @IsBoolean()
  @IsOptional()
  allowNonKomatsuInfoUse: boolean;
}
