import { MachineReportLocationInput } from '@machine-report/dtos';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_MULTI_LINE_REGEX,
} from '@shared/constants';
import { TransformNullToEmpty, TrimString } from '@shared/decorators';
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

import { MachineReportMediaInput } from '.';

export class MachineReportBaseInput extends MachineReportLocationInput {
  @ApiPropertyOptional()
  @IsString()
  @TrimString()
  @IsOptional()
  @TransformNullToEmpty()
  @RegexMatches([INVALID_CHARACTER_MULTI_LINE_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  @Length(0, 1000)
  reportComment: string;

  @ApiPropertyOptional(defaultExamples.machineReportMedias)
  @IsArray()
  @ArrayMaxSize(2)
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MachineReportMediaInput)
  machineReportMedias: MachineReportMediaInput[];
}
