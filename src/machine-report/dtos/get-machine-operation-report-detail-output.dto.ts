import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples, DevicePlatform, Subtype } from '@shared/constants';
import { Expose } from 'class-transformer';

export class GetMachineOperationReportDetailOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportId: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  reportedAt: Date;

  @Expose()
  @ApiProperty()
  reportTitle: string;

  @Expose()
  @ApiProperty(defaultExamples.subtype)
  subtype: Subtype;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userId: string;

  @Expose()
  @ApiProperty()
  givenName: string;

  @Expose()
  @ApiProperty()
  surname: string;

  @Expose()
  @ApiProperty({ nullable: true })
  userPictureUrl: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportResponseId: string;

  @Expose()
  @ApiProperty(defaultExamples.timeSinceCommentCreation)
  timeSinceCommentCreation: string;

  @Expose()
  @ApiPropertyOptional()
  lat: string;

  @Expose()
  @ApiPropertyOptional()
  lng: string;

  @Expose()
  @ApiPropertyOptional()
  locationAccuracy: string;

  @Expose()
  @ApiPropertyOptional(defaultExamples.devicePlatform)
  devicePlatform: DevicePlatform;

  @Expose()
  @ApiProperty()
  startAt: Date;

  @Expose()
  @ApiProperty()
  endAt: Date;

  @Expose()
  @ApiProperty()
  operationDetail: string;

  @Expose()
  @ApiProperty()
  comment: string;
}
