import { MachineReportInput } from '@group/dtos';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Length, ValidateNested } from 'class-validator';

import { InspectionResultBaseInput } from '.';

export class InspectionResultUpdate extends InspectionResultBaseInput {
  @ApiProperty({
    ...defaultExamples.entityId,
    description:
      'DB: `inspection_results.inspection_result_id` inspections results inspection_result_id',
  })
  @Length(26, 26)
  @IsString()
  inspectionResultId: string;

  @ApiPropertyOptional(
    defaultExamples.CreateInspectionInput.inspectionResults.machineReport,
  )
  @Type(() => MachineReportInput)
  @ValidateNested({ each: true })
  @IsOptional()
  machineReport?: MachineReportInput;
}
