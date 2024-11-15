import { MachineReportResponseOutput } from '@machine/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose, Type } from 'class-transformer';

export class MachineReportBaseOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  machineReportId: string;

  @ApiProperty()
  @Expose()
  reportTitle: string;

  @ApiProperty(defaultExamples.entityId)
  @Expose()
  inspectionResultId: string;

  @ApiProperty(defaultExamples.entityId)
  @Expose()
  machineId: string;

  @ApiProperty(defaultExamples.entityId)
  @Expose()
  firstMachineReportResponseId: string;

  @ApiProperty(defaultExamples.entityId)
  @Expose()
  lastMachineReportResponseId: string;

  @ApiProperty(defaultExamples.machineReportStatus)
  @Expose()
  currentStatus: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  lastStatusUpdatedAt: Date;

  @Expose()
  @ApiProperty({ type: () => MachineReportResponseOutput })
  @Type(() => MachineReportResponseOutput)
  firstMachineReportResponse: MachineReportResponseOutput;
}
