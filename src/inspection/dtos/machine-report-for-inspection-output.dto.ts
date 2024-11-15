import { MachineReportMediaOutput } from '@machine/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, DevicePlatform } from '@shared/constants';
import { Expose, Type } from 'class-transformer';

export class MachineReportForInspectionOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportId: string;

  @Expose()
  @ApiProperty()
  reportTitle: string;

  @Expose()
  @ApiProperty()
  reportComment: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  inspectionResultId: string;

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
  @ApiProperty({ ...defaultExamples.devicePlatform, nullable: true })
  devicePlatform: DevicePlatform;

  @Expose()
  @ApiProperty({ type: () => MachineReportMediaOutput, isArray: true })
  @Type(() => MachineReportMediaOutput)
  machineReportMedias: MachineReportMediaOutput[];
}
