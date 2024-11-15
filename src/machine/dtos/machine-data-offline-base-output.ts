import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, GroupMachineCondition } from '@shared/constants';
import { TransformValue } from '@shared/decorators';
import { Expose } from 'class-transformer';

export class MachineDataOfflineBaseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  groupId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineId: string;

  @Expose()
  @ApiProperty()
  machineName: string;

  @Expose()
  @ApiProperty()
  machineTypeName: string;

  @Expose()
  @ApiProperty()
  machineManufacturerName: string;

  @Expose()
  @ApiProperty()
  serialNumber: string;

  @Expose()
  @ApiProperty()
  pictureUrl: string;

  @Expose()
  @ApiProperty()
  serialNumberPlatePictureUrl: string;

  @Expose()
  @ApiProperty()
  modelAndType: string;

  @Expose()
  @ApiProperty({ enum: GroupMachineCondition })
  machineCondition: GroupMachineCondition;

  @Expose()
  @ApiProperty()
  machineReportCount: number;

  @Expose()
  @ApiProperty()
  isFavorite: boolean;

  @Expose()
  @TransformValue('', null)
  @ApiProperty({ nullable: true })
  customTypeName: string;

  @Expose()
  @TransformValue('', null)
  @ApiProperty({ nullable: true })
  customMachineManufacturerName: string;
}
