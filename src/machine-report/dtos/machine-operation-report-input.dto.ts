import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_MULTI_LINE_REGEX,
  INVALID_CHARACTER_REGEX,
} from '@shared/constants';
import { TransformNullToEmpty, TrimString } from '@shared/decorators';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, Length } from 'class-validator';

import { MachineReportLocationInput } from '.';

export class MachineOperationReportInput extends MachineReportLocationInput {
  @ApiProperty()
  @Length(1, 100)
  @IsString()
  @TrimString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  operationDetail: string;

  @ApiProperty(defaultExamples.dateTime)
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  startAt: Date;

  @ApiPropertyOptional(defaultExamples.dateTime)
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsOptional()
  endAt: Date;

  @ApiPropertyOptional()
  @IsString()
  @TrimString()
  @IsOptional()
  @TransformNullToEmpty()
  @RegexMatches([INVALID_CHARACTER_MULTI_LINE_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @Length(0, 1000)
  comment: string;
}
