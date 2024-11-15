import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrimString } from '@shared/decorators';
import { IsOptional, IsString } from 'class-validator';

export class GroupCandidateUserQuery {
  @IsString()
  @IsOptional()
  @TrimString()
  @ApiPropertyOptional()
  search: string;
}
