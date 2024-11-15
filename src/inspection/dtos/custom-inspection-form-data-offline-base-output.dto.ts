import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class CustomInspectionFormDataOfflineBaseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  customInspectionFormId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineId: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  lastStatusUpdatedAt: Date;
}
