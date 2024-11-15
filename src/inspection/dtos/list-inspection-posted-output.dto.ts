import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class ListInspectionOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  inspectionId: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionFormName)
  name: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  lastStatusUpdatedAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.inspectionReportCount)
  inspectionReportCount: number;
}
