import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_MULTI_LINE_REGEX,
} from '@shared/constants';
import { TrimString } from '@shared/decorators';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { PartReplacementMediaBaseInput } from '.';

export class PartReplacementBaseInput {
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'partTypeId',
  })
  @Length(26, 26)
  @IsString()
  partTypeId: string;

  @IsString()
  @ApiProperty()
  @RegexMatches([INVALID_CHARACTER_MULTI_LINE_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @TrimString()
  content: string;

  @ApiPropertyOptional()
  @IsArray()
  @ArrayMaxSize(2)
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PartReplacementMediaBaseInput)
  partReplacementMedias: PartReplacementMediaBaseInput[];
}
