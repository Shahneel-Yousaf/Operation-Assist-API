import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  dateFormat,
  defaultExamples,
  EMAIL_REGEX,
  EMOJI_REGEX,
  INVALID_CHARACTER_REGEX,
  ISOLocaleCode,
  ResidenceCountryCode,
} from '@shared/constants';
import {
  TransformNullToEmpty,
  TransformValue,
  TrimString,
} from '@shared/decorators';
import {
  IsDateFormatString,
  RegexMatches,
  RegexNotMatches,
} from '@shared/validations';
import { IsBoolean, IsEnum, IsOptional, Length } from 'class-validator';

export class UpdateUserProfileInput {
  @ApiPropertyOptional()
  @TrimString()
  @IsOptional()
  @Length(1, 64)
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  surname: string;

  @ApiPropertyOptional()
  @TrimString()
  @IsOptional()
  @Length(1, 64)
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  givenName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(0, 512)
  @TransformNullToEmpty()
  pictureUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isSearchableByEmail: boolean;

  @ApiPropertyOptional(defaultExamples.localeCode)
  @IsEnum(ISOLocaleCode)
  @IsOptional()
  @Length(1, 10)
  isoLocaleCode: ISOLocaleCode;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(1, 2)
  @IsEnum(ResidenceCountryCode)
  residenceCountryCode: string;

  @ApiPropertyOptional(defaultExamples.yearOnly)
  @TransformValue('', null)
  @IsDateFormatString([dateFormat.yearOnlyFormat])
  @IsOptional()
  dateOfBirth: string;

  @ApiPropertyOptional(defaultExamples.userEmail)
  @IsOptional()
  @Length(1, 113)
  @RegexMatches([EMAIL_REGEX])
  email: string;
}
