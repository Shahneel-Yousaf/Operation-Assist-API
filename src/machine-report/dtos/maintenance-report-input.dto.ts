import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  EMOJI_REGEX,
  INVALID_CHARACTER_MULTI_LINE_REGEX,
} from '@shared/constants';
import { TransformStringNumber } from '@shared/decorators';
import {
  IsArrayUnique,
  RegexMatches,
  RegexNotMatches,
} from '@shared/validations';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  ValidateNested,
} from 'class-validator';

import { MachineReportLocationInput, MachineReportMediaInput } from '.';

export class MaintenanceReportInput extends MachineReportLocationInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @RegexMatches([INVALID_CHARACTER_MULTI_LINE_REGEX])
  @RegexNotMatches([EMOJI_REGEX])
  comment: string;

  @ApiProperty()
  @IsNumber()
  @Max(9999999.9)
  @TransformStringNumber()
  serviceMeterInHour: number;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  workAt: Date;

  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'regularMaintenanceItemChoiceId',
  })
  @Length(26, 26)
  @IsString()
  regularMaintenanceItemChoiceId: string;

  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'maintenanceReasonChoiceId',
  })
  @Length(26, 26)
  @IsString()
  maintenanceReasonChoiceId: string;

  @ApiPropertyOptional({
    ...defaultExamples.entityId,
    description: 'maintenanceReasonPeriodChoiceId',
  })
  @IsOptional()
  @Length(26, 26)
  @IsString()
  maintenanceReasonPeriodChoiceId: string;

  @ApiPropertyOptional(defaultExamples.irregularMaintenanceItemChoiceIdArray)
  @IsArrayUnique()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Length(26, 26, { each: true })
  irregularMaintenanceItemChoiceIds: string[];

  @ApiPropertyOptional(defaultExamples.machineReportMedias)
  @IsArray()
  @ArrayMaxSize(10)
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MachineReportMediaInput)
  machineReportMedias: MachineReportMediaInput[];
}
