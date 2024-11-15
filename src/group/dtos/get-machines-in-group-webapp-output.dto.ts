import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples, GroupMachineCondition } from '@shared/constants';
import { TransformValue } from '@shared/decorators';
import { Expose } from 'class-transformer';

export class GetMachinesInGroupWebappOutput {
  @Expose()
  @ApiProperty()
  machineManufacturerName: string;

  @Expose()
  @ApiProperty()
  machineType: string;

  @Expose()
  @ApiProperty()
  serviceMeter: number;

  @Expose()
  @ApiProperty()
  reportCount: number;

  @Expose()
  @ApiPropertyOptional()
  reportOpenCount: number;

  @Expose()
  @ApiProperty()
  countReport: number;

  @Expose()
  @ApiPropertyOptional()
  countReportOpen: number;

  @Expose()
  @ApiProperty(defaultExamples.machineCondition)
  machineCondition: GroupMachineCondition;

  @Expose()
  @ApiProperty()
  machineId: string;

  @Expose()
  @ApiProperty()
  @TransformValue('', null)
  machineName: string;

  @Expose()
  @ApiProperty()
  @TransformValue('', null)
  pictureUrl: string;

  @Expose()
  @ApiProperty()
  @TransformValue('', null)
  modelAndType: string;

  @Expose()
  @ApiProperty()
  @TransformValue('', null)
  serialNumber: string;

  @Expose()
  @ApiProperty({ nullable: true })
  @TransformValue('', null)
  serialNumberPlatePictureUrl: string;

  @Expose()
  @ApiProperty({ nullable: true })
  @TransformValue('', null)
  customMachineManufacturerName: string;

  @Expose()
  @ApiProperty({ nullable: true })
  @TransformValue('', null)
  customTypeName: string;
}
