import { PaginationInputQuery } from '@group/dtos';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  MachineSummaryType,
  TIMEZONE_REGEX,
} from '@shared/constants';
import { IsArrayUnique, RegexMatches } from '@shared/validations';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { GetMachineSummaryOrderBy } from '.';

export class GetMachineSummaryQuery extends PaginationInputQuery {
  @ApiPropertyOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional({
    description: 'Filter record machine summary',
    example: MachineSummaryType.INSPECTION,
    enum: MachineSummaryType,
  })
  @IsOptional()
  @IsEnum(MachineSummaryType)
  filter: MachineSummaryType;

  @ApiPropertyOptional({
    type: GetMachineSummaryOrderBy,
  })
  @IsArrayUnique('field')
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GetMachineSummaryOrderBy)
  orderBys: GetMachineSummaryOrderBy[];

  @ApiPropertyOptional(defaultExamples.timezoneUtc)
  @RegexMatches([TIMEZONE_REGEX])
  @IsOptional()
  utc: string = '+00:00';
}
