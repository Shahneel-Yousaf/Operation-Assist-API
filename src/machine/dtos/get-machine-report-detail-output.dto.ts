import { ApiProperty } from '@nestjs/swagger';
import {
  defaultExamples,
  MachineReportCurrentStatus,
  MachineReportResponseStatus,
} from '@shared/constants';
import { Expose, Type } from 'class-transformer';

import { MachineReportResponseBaseOutput } from '.';

export class GetMachineReportDetailOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportId: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  reportedAt: Date;

  @Expose()
  @ApiProperty()
  reportTitle: string;

  @ApiProperty()
  @Expose()
  isRead: boolean;

  @Expose()
  @ApiProperty(defaultExamples.machineReportStatus)
  reportStatus: MachineReportCurrentStatus;

  @Expose()
  @ApiProperty(defaultExamples.machineReportResponseStatus)
  reportResponseStatus: MachineReportResponseStatus;

  @Expose()
  @ApiProperty({ type: () => MachineReportResponseBaseOutput, isArray: true })
  @Type(() => MachineReportResponseBaseOutput)
  machineReportResponses: MachineReportResponseBaseOutput[];
}
