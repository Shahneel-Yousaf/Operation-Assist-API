import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetGroupInspectionFormDetailOutput {
  @Expose()
  @ApiProperty()
  inspectionFormCount: number;

  @Expose()
  @ApiProperty()
  publishedStatusCount: number;

  @Expose()
  @ApiProperty()
  draftStatusCount: number;
}
