import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, MachineCurrentStatus } from '@shared/constants';
import { TransformValue } from '@shared/decorators';
import { Expose } from 'class-transformer';

export class MachineOutput {
  @Expose()
  @ApiProperty()
  machineId: string;

  @Expose()
  @ApiProperty()
  @TransformValue('', null)
  machineName: string;

  @Expose()
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'Machine type ID of the machine',
  })
  machineTypeId: string;

  @Expose()
  @ApiProperty()
  @TransformValue('', null)
  pictureUrl: string;

  @Expose()
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'Machine manufacturer ID of the machine',
  })
  machineManufacturerId: string;

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
  @ApiProperty()
  currentStatus: MachineCurrentStatus;

  @Expose()
  @ApiProperty()
  lastStatusUpdatedAt: string;

  @Expose()
  @ApiProperty({ nullable: true })
  @TransformValue('', null)
  customMachineManufacturerName: string;

  @Expose()
  @ApiProperty({ nullable: true })
  @TransformValue('', null)
  customTypeName: string;
}
