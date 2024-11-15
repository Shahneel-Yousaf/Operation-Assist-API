import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class GroupAvailableMachineOutput {
  @Expose()
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'The machine ID',
  })
  machineId: string;

  @Expose()
  @ApiProperty()
  machineName: string;

  @Expose()
  @ApiProperty({ nullable: true })
  pictureUrl: string;

  @Expose()
  @ApiProperty(defaultExamples.modelAndType)
  modelAndType: string;

  @Expose()
  @ApiPropertyOptional({
    ...defaultExamples.isAlreadyInGroup,
    description: 'Flag to check the machine already in the group',
  })
  isAlreadyInGroup: boolean;

  @Expose()
  @ApiProperty()
  machineManufacturerName: string;
}
