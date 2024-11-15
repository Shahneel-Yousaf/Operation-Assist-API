import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { GetGroupsOutput } from './get-groups-output.dto';

export class GetGroupsBaseOutput {
  @ApiProperty({ type: () => GetGroupsOutput, isArray: true })
  @Expose()
  @Type(() => GetGroupsOutput)
  archivedGroups: GetGroupsOutput[];

  @ApiProperty({ type: () => GetGroupsOutput, isArray: true })
  @Expose()
  @Type(() => GetGroupsOutput)
  unarchivedGroups: GetGroupsOutput[];
}
