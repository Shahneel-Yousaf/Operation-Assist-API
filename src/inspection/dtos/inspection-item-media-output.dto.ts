import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class InspectionItemMediaOutput {
  @Expose()
  @ApiProperty(defaultExamples.inspectionItemMediaOutput.fileName)
  fileName: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemMediaOutput.filePath)
  filePath: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemMediaOutput.mediaUrl)
  mediaUrl: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemMediaOutput.mimeType)
  mimeType: string;

  @Expose()
  @ApiProperty({
    ...defaultExamples.dateTime,
    description:
      defaultExamples.inspectionItemMediaOutput.createdAt.description,
  })
  createdAt: Date;
}
