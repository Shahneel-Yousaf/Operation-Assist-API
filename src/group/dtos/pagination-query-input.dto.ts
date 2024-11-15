import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, Min } from 'class-validator';

import { LimitQuery } from '.';

export class PaginationInputQuery extends LimitQuery {
  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsOptional()
  firstRequestTime: Date;
}
