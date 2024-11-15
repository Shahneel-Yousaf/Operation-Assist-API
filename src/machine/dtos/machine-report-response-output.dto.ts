import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  DevicePlatform,
  MachineReportResponseStatus,
} from '@shared/constants';
import { Expose, Type } from 'class-transformer';

import { MachineReportMediaOutput } from '.';

export class MachineReportResponseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportResponseId: string;

  @Expose()
  @ApiProperty()
  reportComment: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  commentedAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userId: string;

  @Expose()
  @ApiProperty(defaultExamples.machineReportStatus)
  status: MachineReportResponseStatus;

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
  @ApiProperty({ type: () => [MachineReportMediaOutput] })
  @Type(() => MachineReportMediaOutput)
  machineReportMedias: MachineReportMediaOutput[];
}
