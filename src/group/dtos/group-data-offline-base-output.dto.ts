import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class GroupDataOfflineBaseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  groupId: string;

  @Expose()
  @ApiProperty()
  groupName: string;

  @Expose()
  @ApiProperty()
  machineAssignmentCount: number;

  @Expose()
  @ApiProperty()
  userAssignmentCount: number;
}
