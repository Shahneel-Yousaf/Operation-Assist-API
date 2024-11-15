import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class MachineManufacturerOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  machineManufacturerId: string;

  @ApiProperty()
  @Expose()
  machineManufacturerName: string;

  @ApiProperty()
  @Expose()
  isOtherMachineManufacturer: boolean;
}
