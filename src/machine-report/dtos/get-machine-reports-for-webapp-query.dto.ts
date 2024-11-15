import { PaginationInputQuery } from '@group/dtos';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MachineReportResponseStatus } from '@shared/constants';
import { IsArrayUnique } from '@shared/validations';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';

import { GetMachineReportsForWebappOrderBy } from '.';

export class GetMachineReportsForWebappQuery extends PaginationInputQuery {
  @ApiPropertyOptional({
    type: MachineReportResponseStatus,
  })
  @IsEnum(MachineReportResponseStatus)
  @IsOptional()
  responseStatus: MachineReportResponseStatus;

  @ApiPropertyOptional({
    type: GetMachineReportsForWebappOrderBy,
  })
  @IsArrayUnique('field')
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GetMachineReportsForWebappOrderBy)
  orderBys: GetMachineReportsForWebappOrderBy[];
}
