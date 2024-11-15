import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  DevicePlatform,
  InspectionCurrentStatus,
} from '@shared/constants';
import { Expose, Type } from 'class-transformer';

import { InspectionResultOutput } from '.';

export class CustomInspectionOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  inspectionId: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  inspectionAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineId: string;

  @Expose()
  @ApiProperty({ nullable: true })
  lat: number;

  @Expose()
  @ApiProperty({ nullable: true })
  lng: number;

  @Expose()
  @ApiProperty({ nullable: true })
  locationAccuracy: string;

  @Expose()
  @ApiPropertyOptional({ ...defaultExamples.devicePlatform, nullable: true })
  devicePlatform: DevicePlatform;

  @Expose()
  @ApiProperty({
    enum: InspectionCurrentStatus,
    default: InspectionCurrentStatus.DRAFT,
  })
  currentStatus: InspectionCurrentStatus;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  lastStatusUpdatedAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  customInspectionFormId: string;

  @Expose()
  @ApiProperty()
  givenName: string;

  @Expose()
  @ApiProperty()
  surname: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userId: string;

  @Expose()
  @ApiProperty({ nullable: true })
  userPictureUrl: string;

  @Expose()
  @ApiProperty({ type: () => [InspectionResultOutput] })
  @Type(() => InspectionResultOutput)
  inspectionResults: InspectionResultOutput[];
}
