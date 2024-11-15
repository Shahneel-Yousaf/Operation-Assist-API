import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, GroupMachineCondition } from '@shared/constants';
import { TransformValue } from '@shared/decorators';
import { Expose } from 'class-transformer';

export class MachineDetailInfoOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  machineId: string;

  @ApiProperty()
  @Expose()
  @TransformValue('', null)
  machineName: string;

  @ApiProperty()
  @Expose()
  @TransformValue('', null)
  pictureUrl: string;

  @ApiProperty(defaultExamples.modelAndType)
  @Expose()
  modelAndType: string;

  @ApiProperty()
  @Expose()
  @TransformValue('', null)
  machineManufacturerName: string;

  @ApiProperty()
  @Expose()
  @TransformValue('', null)
  machineTypeName: string;

  @Expose()
  @ApiProperty()
  @TransformValue('', null)
  serialNumber: string;

  @ApiProperty(defaultExamples.machineCondition)
  @Expose()
  machineCondition: GroupMachineCondition;

  @Expose()
  @ApiProperty({ nullable: true })
  @TransformValue('', null)
  serialNumberPlatePictureUrl: string;

  @ApiProperty()
  @Expose()
  isFavorite: boolean;

  @Expose()
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'Machine type ID of the machine',
  })
  machineTypeId: string;

  @Expose()
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'Machine manufacturer ID of the machine',
  })
  machineManufacturerId: string;

  @Expose()
  @ApiProperty()
  @TransformValue('', null)
  filePath: string;

  @Expose()
  @ApiProperty()
  @TransformValue('', null)
  serialNumberFilePath: string;

  @Expose()
  @TransformValue('', null)
  @ApiProperty({ nullable: true })
  customMachineManufacturerName: string;

  @Expose()
  @TransformValue('', null)
  @ApiProperty({ nullable: true })
  customTypeName: string;

  @ApiProperty()
  @Expose()
  isOtherMachineManufacturer: boolean;

  @ApiProperty()
  @Expose()
  isOtherMachineType: boolean;
}
