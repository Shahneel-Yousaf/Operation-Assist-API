import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_REGEX,
} from '@shared/constants';
import { TransformStringNumber, TrimString } from '@shared/decorators';
import { RegexMatches, RegexNotMatches } from '@shared/validations';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { MachineReportBaseInput, SyncMachineReportMediaInput } from '.';

export class SyncMachineReportInput extends MachineReportBaseInput {
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
  @RegexNotMatches([EMOJI_REGEX])
  @Length(1, 100)
  @IsString()
  @TrimString()
  @RegexMatches([INVALID_CHARACTER_REGEX])
  reportTitle: string;

  @ApiPropertyOptional(defaultExamples.syncMachineReportMedias)
  @IsArray()
  @ArrayMaxSize(2)
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SyncMachineReportMediaInput)
  machineReportMedias: SyncMachineReportMediaInput[];

  @ApiProperty(defaultExamples.dateTime)
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  lastStatusUpdatedAt: Date;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @TransformStringNumber()
  serviceMeterInHour: number;
}
