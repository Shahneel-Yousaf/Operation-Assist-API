import { ApiPropertyOptional } from '@nestjs/swagger';
import { CustomInspectionFormCurrentStatus } from '@shared/constants';
import { PaginationQuery } from '@shared/dtos';
import { IsArrayUnique } from '@shared/validations';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';

import { GetGroupInspectionFormOrderBy } from '.';

export class GetGroupInspectionFormQuery extends PaginationQuery {
  @ApiPropertyOptional({
    type: GetGroupInspectionFormOrderBy,
  })
  @IsArrayUnique('field')
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GetGroupInspectionFormOrderBy)
  orderBys: GetGroupInspectionFormOrderBy[];

  @ApiPropertyOptional({
    type: CustomInspectionFormCurrentStatus,
  })
  @IsEnum(CustomInspectionFormCurrentStatus)
  @IsOptional()
  currentStatus: CustomInspectionFormCurrentStatus;
}
