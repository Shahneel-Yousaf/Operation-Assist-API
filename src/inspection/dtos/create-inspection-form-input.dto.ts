import { ApiProperty } from '@nestjs/swagger';
import {
  CustomInspectionFormCurrentStatus,
  defaultExamples,
  EMOJI_REGEX,
  InspectionFormType,
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
  ArrayMinSize,
  IsEnum,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { CreateCustomInspectionItemInput } from '.';

export class CreateInspectionFormInput {
  @ApiProperty(defaultExamples.entityId)
  @Length(26, 26)
  @IsString()
  inspectionFormId: string;

  @ApiProperty()
  @IsEnum(InspectionFormType)
  inspectionFormType: InspectionFormType;

  @ApiProperty()
  @TrimString()
  @DraftMinLengthValidator(1)
  @MaxLength(50)
  @IsString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  name: string;

  @ApiProperty({
    enum: CustomInspectionFormCurrentStatus,
    default: CustomInspectionFormCurrentStatus.PUBLISHED,
  })
  @IsEnum([
    CustomInspectionFormCurrentStatus.DRAFT,
    CustomInspectionFormCurrentStatus.PUBLISHED,
  ])
  currentStatus: CustomInspectionFormCurrentStatus;

  @ApiProperty({ type: () => CreateCustomInspectionItemInput, isArray: true })
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => CreateCustomInspectionItemInput)
  customInspectionItems: CreateCustomInspectionItemInput[];
}
