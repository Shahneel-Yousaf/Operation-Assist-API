import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { ScreenPermissionResponse } from '@shared/dtos';
import { Expose } from 'class-transformer';

export class GetGroupWebappOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  groupId: string;

  @Expose()
  @ApiProperty()
  groupName: string;

  @Expose()
  @ApiProperty()
  machineCount: number;

  @Expose()
  @ApiProperty()
  reportCount: number;

  @Expose()
  @ApiProperty()
  inspectionFormCount: number;

  @Expose()
  @ApiProperty()
  memberCount: number;

  @Expose()
  @ApiPropertyOptional()
  location: string;

  @Expose()
  @ApiProperty()
  currentStatus: string;

  @Expose()
  @ApiProperty()
  companyName: string;

  @Expose()
  @ApiProperty()
  permissions: ScreenPermissionResponse;
}
