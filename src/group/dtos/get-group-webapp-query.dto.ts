import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQuery } from '@shared/dtos';
import { IsArrayUnique } from '@shared/validations';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

import { GetGroupWebappOrderBy } from '.';

export class GetGroupWebappQuery extends PaginationQuery {
  @ApiPropertyOptional({
    type: GetGroupWebappOrderBy,
  })
  @IsArrayUnique('field')
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GetGroupWebappOrderBy)
  orderBys: GetGroupWebappOrderBy[];
}
