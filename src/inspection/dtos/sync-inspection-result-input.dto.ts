import { SyncMachineReportInspectionInput } from '@machine-report/dtos';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Length, ValidateNested } from 'class-validator';

import { InspectionResultBaseInput } from '.';

export class SyncInspectionResultInput extends InspectionResultBaseInput {
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'inspectionResultId',
  })
  @Length(26, 26)
  @IsString()
  inspectionResultId: string;

  @ApiPropertyOptional(
    defaultExamples.CreateInspectionInput.inspectionResults.machineReport,
  )
  @Type(() => SyncMachineReportInspectionInput)
  @ValidateNested({ each: true })
  @IsOptional()
  machineReport?: SyncMachineReportInspectionInput;
}
