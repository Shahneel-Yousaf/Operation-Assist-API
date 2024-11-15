import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class PartReplacementMediaBaseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  partReplacementMediaId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  partReplacementId: string;

  @Expose()
  @ApiProperty(defaultExamples.partReplacementMediaOutput.fileName)
  fileName: string;

  @Expose()
  @ApiProperty(defaultExamples.partReplacementMediaOutput.mediaUrl)
  mediaUrl: string;

  @Expose()
  @ApiProperty(defaultExamples.partReplacementMediaOutput.mimeType)
  mimeType: string;

  @Expose()
  @ApiProperty(defaultExamples.partReplacementMediaOutput.createdAt)
  createdAt: string;

  @Expose()
  @ApiProperty(defaultExamples.partReplacementMediaOutput.thumbnail)
  thumbnail: string;
}
