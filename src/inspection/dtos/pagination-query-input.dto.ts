import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQuery } from '@shared/dtos/pagination-query.dto';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class PaginationInputQuery extends PaginationQuery {
  @ApiPropertyOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsOptional()
  firstRequestTime: Date;
}
