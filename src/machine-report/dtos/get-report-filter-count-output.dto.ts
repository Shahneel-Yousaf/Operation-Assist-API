import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class GetReportFilterCountOutput {
  @Expose()
  @ApiProperty(defaultExamples.getReportFilterCountOutput.latestServiceMeter)
  latestServiceMeter: number;

  @Expose()
  @ApiProperty(
    defaultExamples.getReportFilterCountOutput.latestServiceMeterUpdatedAt,
  )
  latestServiceMeterUpdatedAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.getReportFilterCountOutput.reportCount)
  reportCount: number;

  @Expose()
  @ApiProperty(
    defaultExamples.getReportFilterCountOutput.maintenanceReportCount,
  )
  maintenanceReportCount: number;

  @Expose()
  @ApiProperty(defaultExamples.getReportFilterCountOutput.incidentReportCount)
  incidentReportCount: number;

  @Expose()
  @ApiProperty(defaultExamples.getReportFilterCountOutput.inspectionReportCount)
  inspectionReportCount: number;
}
