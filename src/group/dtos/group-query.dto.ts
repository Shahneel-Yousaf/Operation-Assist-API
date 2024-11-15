import { ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { IsOptional, Length } from 'class-validator';

export class GroupQuery {
  @ApiPropertyOptional(defaultExamples.groupQuery)
  @Length(26, 26)
  @IsOptional()
  groupId: string;
}
