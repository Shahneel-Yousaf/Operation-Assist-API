import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CustomInspectionItemResultType,
  EMOJI_REGEX,
  INVALID_CHARACTER_MULTI_LINE_REGEX,
  INVALID_CHARACTER_REGEX,
} from '@shared/constants';
import { TrimString } from '@shared/decorators';
import {
  DraftMinLengthValidator,
  RegexMatches,
  RegexNotMatches,
} from '@shared/validations';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { CustomInspectionItemMediaInput } from '.';

export class CustomInspectionItemBaseInput {
  @ApiPropertyOptional()
  @TrimString()
  @MaxLength(50)
  @IsString()
  @IsOptional()
  itemCode: string;

  @ApiProperty()
  @TrimString()
  @DraftMinLengthValidator(1)
  @MaxLength(100)
  @IsString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  name: string;

  @ApiPropertyOptional()
  @TrimString()
  @RegexMatches([INVALID_CHARACTER_MULTI_LINE_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @Length(0, 150)
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description:
      '`OK_OR_ANOMARY` : allow select value of `[OK, ANOMARY]`, `NUMERIC` : allow input number , default: `OK_OR_ANOMARY`',
  })
  @IsEnum(CustomInspectionItemResultType)
  resultType: CustomInspectionItemResultType;

  @ApiProperty()
  @IsBoolean()
  isImmutable: boolean;

  @ApiProperty()
  @IsBoolean()
  isForcedRequired: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isRequired: boolean;

  @ApiPropertyOptional({
    type: () => CustomInspectionItemMediaInput,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CustomInspectionItemMediaInput)
  customInspectionItemMedias: CustomInspectionItemMediaInput[];
}
