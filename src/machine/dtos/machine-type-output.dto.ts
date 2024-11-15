import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class MachineTypeOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  machineTypeId: string;

  @ApiProperty()
  @Expose()
  machineTypeCode: string;

  @ApiProperty()
  @Expose()
  typeName: string;

  @ApiProperty()
  @Expose()
  pictureUrl: string;

  @ApiProperty()
  @Expose()
  isOtherMachineType: boolean;
}
