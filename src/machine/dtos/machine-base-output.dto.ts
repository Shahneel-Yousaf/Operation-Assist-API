import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, GroupMachineCondition } from '@shared/constants';
import { Expose } from 'class-transformer';

export class MachineBaseOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  machineId: string;

  @ApiProperty()
  @Expose()
  machineName: string;

  @ApiProperty()
  @Expose()
  pictureUrl: string;

  @ApiProperty(defaultExamples.modelAndType)
  @Expose()
  modelAndType: string;

  @ApiProperty()
  @Expose()
  machineManufacturerName: string;

  @ApiProperty(defaultExamples.machineCondition)
  @Expose()
  machineCondition: GroupMachineCondition;

  @ApiProperty()
  @Expose()
  machineReportCount: number;

  @ApiProperty()
  @Expose()
  isFavorite: boolean;
}
