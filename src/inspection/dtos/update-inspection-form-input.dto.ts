import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CustomInspectionFormCurrentStatus,
  EMOJI_REGEX,
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
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { UpdateCustomInspectionItemInput } from '.';

export class UpdateInspectionFormInput {
  @ApiProperty()
  @TrimString()
  @DraftMinLengthValidator(1)
  @MaxLength(50)
  @IsString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  name: string;

  @ApiPropertyOptional({
    enum: CustomInspectionFormCurrentStatus,
    default: CustomInspectionFormCurrentStatus.PUBLISHED,
  })
  @IsEnum([
    CustomInspectionFormCurrentStatus.DRAFT,
    CustomInspectionFormCurrentStatus.PUBLISHED,
  ])
  @IsOptional()
  currentStatus: CustomInspectionFormCurrentStatus;

  @ApiProperty({ type: () => UpdateCustomInspectionItemInput, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => UpdateCustomInspectionItemInput)
  customInspectionItems: UpdateCustomInspectionItemInput[];
}
