import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { MachineBaseOutput } from '.';

export class GetMachinesInGroupOutput {
  @ApiProperty({ type: () => MachineBaseOutput, isArray: true })
  @Expose()
  @Type(() => MachineBaseOutput)
  favoriteMachines: MachineBaseOutput[];

  @ApiProperty({ type: () => MachineBaseOutput, isArray: true })
  @Expose()
  @Type(() => MachineBaseOutput)
  unFavoriteMachines: MachineBaseOutput[];
}
