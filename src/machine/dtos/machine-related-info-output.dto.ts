import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import {
  MachineManufacturerOutput,
  MachineTypeOutput,
  SerialNumberOutput,
} from '.';

export class MachineRelatedInfoOutput {
  @ApiProperty({ type: () => MachineManufacturerOutput, isArray: true })
  @Expose()
  @Type(() => MachineManufacturerOutput)
  machineManufacturers: MachineManufacturerOutput[];

  @ApiProperty({ type: () => MachineTypeOutput, isArray: true })
  @Expose()
  @Type(() => MachineTypeOutput)
  machineTypes: MachineTypeOutput[];

  @ApiProperty({ type: () => SerialNumberOutput, isArray: true })
  @Expose()
  @Type(() => SerialNumberOutput)
  validationSerialNumber: SerialNumberOutput[];
}
