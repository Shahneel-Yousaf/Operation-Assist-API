import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { GroupDetailInfoOutput } from '.';

export class GroupDetailInfoWebappOutput extends GroupDetailInfoOutput {
  @Expose()
  @ApiProperty()
  machineCount: number;

  @Expose()
  @ApiProperty()
  inspectionFormCount: number;

  @Expose()
  @ApiProperty()
  reportCount: number;

  @Expose()
  @ApiProperty()
  memberCount: number;
}
