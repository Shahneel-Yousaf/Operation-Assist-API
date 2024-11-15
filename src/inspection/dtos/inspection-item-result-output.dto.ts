import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose, Type } from 'class-transformer';

import { InspectionItemOutput, MachineReportForInspectionOutput } from '.';

export class InspectionItemResultOutput extends InspectionItemOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  inspectionResultId: string;

  @Expose()
  @ApiProperty()
  result: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  inspectionId: string;

  @Expose()
  @ApiProperty()
  position: number;

  @Expose()
  @ApiProperty({ type: () => MachineReportForInspectionOutput, nullable: true })
  @Type(() => MachineReportForInspectionOutput)
  machineReport: MachineReportForInspectionOutput;
}
