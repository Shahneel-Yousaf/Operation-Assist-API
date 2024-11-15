import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class ListUserInspectionFormDraftsOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  customInspectionFormId: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionFormName)
  name: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  lastStatusUpdatedAt: Date;
}
