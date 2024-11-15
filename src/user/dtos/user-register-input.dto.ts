import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  dateFormat,
  defaultExamples,
  EMAIL_REGEX,
  EMOJI_REGEX,
  INVALID_CHARACTER_REGEX,
  ISOLocaleCode,
  ResidenceCountryCode,
} from '@shared/constants';
import { TransformNullToEmpty, TrimString } from '@shared/decorators';
import {
  IsDateFormatString,
  RegexMatches,
  RegexNotMatches,
} from '@shared/validations';
import { IsBoolean, IsEnum, IsOptional, Length } from 'class-validator';

export class RegisterUserInput {
  @ApiProperty()
  @TrimString()
  @Length(1, 64)
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  surname: string;

  @ApiProperty()
  @TrimString()
  @Length(1, 64)
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  givenName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Length(0, 512)
  @TransformNullToEmpty()
  pictureUrl: string;

  @ApiProperty(defaultExamples.userEmail)
  @Length(1, 113)
  @RegexMatches([EMAIL_REGEX])
  email: string;

  @ApiProperty()
  @IsBoolean()
  isSearchableByEmail: boolean;

  @ApiPropertyOptional(defaultExamples.localeCode)
  @IsEnum(ISOLocaleCode)
  @IsOptional()
  @Length(1, 10)
  isoLocaleCode: ISOLocaleCode;

  @ApiProperty()
  @Length(1, 2)
  @IsEnum(ResidenceCountryCode)
  residenceCountryCode: string;

  @ApiPropertyOptional(defaultExamples.yearOnly)
  @IsDateFormatString([dateFormat.yearOnlyFormat])
  @IsOptional()
  dateOfBirth: string;
}
