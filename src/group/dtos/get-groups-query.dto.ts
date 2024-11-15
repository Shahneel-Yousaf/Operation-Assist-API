import { ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples, UserGroupArchiveStatus } from '@shared/constants';
import { IsEnum, IsOptional } from 'class-validator';

import { GetGroupWebappQuery } from '.';

export class GetGroupsQuery extends GetGroupWebappQuery {
  @ApiPropertyOptional(defaultExamples.getGroupsQuery)
  @IsEnum(UserGroupArchiveStatus)
  @IsOptional()
  status: UserGroupArchiveStatus;
}
