import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples, GroupCurrentStatus } from '@shared/constants';
import { Expose } from 'class-transformer';

export class UpdateGroupOutput {
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'The group ID to update',
  })
  @Expose()
  groupId: string;

  @ApiPropertyOptional()
  @Expose()
  groupName: string;

  @ApiPropertyOptional()
  @Expose()
  location: string;

  @ApiPropertyOptional()
  @Expose()
  companyName: string;

  @ApiProperty({
    ...defaultExamples.groupCurrentStatus,
    example: GroupCurrentStatus.UPDATED,
  })
  @Expose()
  currentStatus: string;

  @ApiProperty(defaultExamples.dateTime)
  @Expose()
  lastStatusUpdatedAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.createGroupInput.allowNonKomatsuInfoUse)
  allowNonKomatsuInfoUse: boolean;
}
