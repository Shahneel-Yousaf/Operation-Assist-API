import { MachineReportBaseInput } from '@machine-report/dtos';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_REGEX,
} from '@shared/constants';
import { TransformStringNumber, TrimString } from '@shared/decorators';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import { IsNumber, IsOptional, IsString, Length, Max } from 'class-validator';

export class MachineReportInput extends MachineReportBaseInput {
  @ApiProperty()
  @Length(1, 100)
  @IsString()
  @TrimString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  reportTitle: string;

  @ApiPropertyOptional(defaultExamples.machineReport.serviceMeterInHour)
  @IsNumber()
  @IsOptional()
  @Max(999999.9)
  @TransformStringNumber()
  serviceMeterInHour: number;
}
