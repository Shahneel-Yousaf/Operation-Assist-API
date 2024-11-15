import { ApiProperty } from '@nestjs/swagger';
import {
  defaultExamples,
  UserGroupAssignmentCurrentStatus,
} from '@shared/constants';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class UserGroupAssignmentOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  groupId: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  lastStatusUpdatedAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Current status of the user group assignment',
    example: UserGroupAssignmentCurrentStatus.ASSIGNED,
    enum: UserGroupAssignmentCurrentStatus,
  })
  @IsEnum(UserGroupAssignmentCurrentStatus)
  currentStatus: UserGroupAssignmentCurrentStatus;

  @Expose()
  @ApiProperty()
  userGroupRoleName: string;
}
