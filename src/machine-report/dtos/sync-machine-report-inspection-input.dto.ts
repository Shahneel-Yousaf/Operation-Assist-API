import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_REGEX,
} from '@shared/constants';
import { TransformStringNumber, TrimString } from '@shared/decorators';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { MachineReportBaseInput, SyncMachineReportMediaInput } from '.';

export class SyncMachineReportInspectionInput extends MachineReportBaseInput {
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'machineReportId',
  })
  @Length(26, 26)
  @IsString()
  machineReportId: string;

  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'machineReportResponseId',
  })
  @Length(26, 26)
  @IsString()
  machineReportResponseId: string;

  @ApiProperty()
  @TrimString()
  @RegexNotMatches([EMOJI_REGEX])
  @Length(1, 100)
  @IsString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  reportTitle: string;

  @ApiPropertyOptional(defaultExamples.syncMachineReportMedias)
  @IsArray()
  @ArrayMaxSize(2)
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SyncMachineReportMediaInput)
  machineReportMedias: SyncMachineReportMediaInput[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @TransformStringNumber()
  serviceMeterInHour: number;
}
