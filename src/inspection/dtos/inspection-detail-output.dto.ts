import { ApiProperty } from '@nestjs/swagger';
import {
  defaultExamples,
  DevicePlatform,
  InspectionCurrentStatus,
  InspectionFormType,
} from '@shared/constants';
import { Expose, Type } from 'class-transformer';

import { InspectionItemResultOutput } from '.';

export class InspectionDetailOutput {
  @Expose()
  @ApiProperty({
    ...defaultExamples.entityId,
    description:
      defaultExamples.inspectionFormOutput.inspectionFormId.description,
  })
  inspectionFormId: string;

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
  pictureUrl: string;

  @Expose()
  @ApiProperty({ nullable: true })
  locationAccuracy: string;

  @Expose()
  @ApiProperty({ nullable: true })
  lat: number;

  @Expose()
  @ApiProperty({ nullable: true })
  lng: number;

  @Expose()
  @ApiProperty({ nullable: true })
  devicePlatform: DevicePlatform;

  @Expose()
  @ApiProperty({ nullable: true })
  odometer: string;

  @Expose()
  @ApiProperty({ nullable: true })
  serviceMeter: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  lastStatusUpdatedAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.inspectionFormOutput.type)
  type: InspectionFormType;

  @Expose()
  @ApiProperty(defaultExamples.inspectionFormOutput.name)
  name: string;

  @Expose()
  @ApiProperty({
    enum: InspectionCurrentStatus,
    default: InspectionCurrentStatus.DRAFT,
  })
  currentStatus: InspectionCurrentStatus;

  @Expose()
  @ApiProperty({ type: () => InspectionItemResultOutput, isArray: true })
  @Type(() => InspectionItemResultOutput)
  inspectionItems: InspectionItemResultOutput;
}
