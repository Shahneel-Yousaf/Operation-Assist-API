import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class MachineReportOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  machineReportId: string;

  @ApiProperty()
  @Expose()
  reportTitle: string;

  @ApiProperty()
  @Expose()
  firstReportComment: string;

  @ApiProperty(defaultExamples.machineReportStatus)
  @Expose()
  currentStatus: string;

  @ApiProperty()
  @Expose()
  machineId: string;
}
