import { MachineReportInput } from '@group/dtos';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { InspectionResultBaseInput } from '.';

export class InspectionResultInput extends InspectionResultBaseInput {
  @ApiPropertyOptional(
    defaultExamples.CreateInspectionInput.inspectionResults.machineReport,
  )
  @Type(() => MachineReportInput)
  @ValidateNested({ each: true })
  @IsOptional()
  machineReport?: MachineReportInput;
}
