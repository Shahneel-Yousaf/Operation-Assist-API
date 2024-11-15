import { ApiProperty } from '@nestjs/swagger';
import { UserGroupAssignmentOutput, UserOutput } from '@user/dtos';
import { Expose, Type } from 'class-transformer';

export class GetUsersInGroupOutput extends UserOutput {
  @ApiProperty()
  @Expose()
  @Type(() => UserGroupAssignmentOutput)
  userGroupAssignment: UserGroupAssignmentOutput;
}
