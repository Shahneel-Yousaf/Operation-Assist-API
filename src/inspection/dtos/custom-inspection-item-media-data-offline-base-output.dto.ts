import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class CustomInspectionItemMediaDataOfflineBaseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  customInspectionItemMediaId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  customInspectionItemId: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemMediaOutput.fileName)
  fileName: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemMediaOutput.mediaUrl)
  mediaUrl: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemMediaOutput.mimeType)
  mimeType: string;
}
