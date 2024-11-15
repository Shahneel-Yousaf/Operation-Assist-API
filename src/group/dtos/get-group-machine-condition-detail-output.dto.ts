import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetGroupMachineConditionDetailOutput {
  @Expose()
  @ApiProperty()
  machineCount: number;

  @Expose()
  @ApiProperty()
  normalStatusCount: number;

  @Expose()
  @ApiProperty()
  warningStatusCount: number;

  @Expose()
  @ApiProperty()
  errorStatusCount: number;
}
