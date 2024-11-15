import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class MachineReportMediaOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportMediaId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportResponseId: string;

  @Expose()
  @ApiProperty()
  filePath: string;

  @Expose()
  @ApiProperty()
  fileName: string;

  @Expose()
  @ApiProperty()
  mediaUrl: string;

  @Expose()
  @ApiProperty()
  mimeType: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  createdAt: Date;

  @Expose()
  @ApiProperty()
  thumbnailUrl: string;
}
