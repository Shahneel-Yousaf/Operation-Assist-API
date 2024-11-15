import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class SyncMachineReportOutput {
  @ApiProperty(defaultExamples.machineReport.machineReportId)
  @Expose()
  machineReportId: string;

  @ApiProperty(defaultExamples.machineReport.reportTitle)
  @Expose()
  reportTitle: string;

  @ApiProperty(defaultExamples.machineReport.firstReportComment)
  @Expose()
  firstReportComment: string;

  @ApiProperty({
    ...defaultExamples.machineReportStatus,
    description: defaultExamples.machineReport.currentStatus.description,
  })
  @Expose()
  currentStatus: string;

  @ApiProperty({
    ...defaultExamples.entityId,
    description: defaultExamples.machineReport.machineId.description,
  })
  @Expose()
  machineId: string;

  @ApiPropertyOptional(defaultExamples.machineReport.syncStatus)
  @Expose()
  syncStatus: string;
}
