import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class SyncInspectionDataOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  inspectionId: string;

  @Expose()
  @ApiProperty({ description: 'SYNCED status' })
  syncStatus: string;
}
