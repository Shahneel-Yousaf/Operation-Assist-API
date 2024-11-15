import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_REGEX,
} from '@shared/constants';
import { TrimString } from '@shared/decorators';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import { IsBoolean, IsOptional, Length } from 'class-validator';

export class UpdateGroupInput {
  @ApiPropertyOptional()
  @Length(1, 255)
  @IsOptional()
  @TrimString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  groupName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @TrimString()
  @Length(0, 255)
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  location: string;

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
