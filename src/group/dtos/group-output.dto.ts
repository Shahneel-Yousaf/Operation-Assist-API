import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, GroupCurrentStatus } from '@shared/constants';
import { Expose } from 'class-transformer';

export class GroupOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  groupId: string;

  @Expose()
  @ApiProperty()
  groupName: string;

  @Expose()
  @ApiProperty()
  companyName: string;

  @Expose()
  @ApiProperty({ nullable: true })
  location: string;

  @Expose()
  @ApiProperty(defaultExamples.groupCurrentStatus)
  currentStatus: GroupCurrentStatus;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  lastStatusUpdatedAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.createGroupInput.allowNonKomatsuInfoUse)
  allowNonKomatsuInfoUse: boolean;
}
