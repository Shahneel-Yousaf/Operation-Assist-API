import { ApiPropertyOptional } from '@nestjs/swagger';
import { dateFormat, defaultExamples, TIMEZONE_REGEX } from '@shared/constants';
import { IsDateFormatString, RegexMatches } from '@shared/validations';
import { IsOptional, IsString, Length } from 'class-validator';

import { PaginationInputQuery } from '.';

export class GetInspectionQuery extends PaginationInputQuery {
  @ApiPropertyOptional({
    ...defaultExamples.monthYearOnly,
    ...defaultExamples.isRequiredForWebapp,
  })
  @IsDateFormatString([dateFormat.monthYearOnlyFormat])
  @IsOptional()
  monthYear: string;

  @ApiPropertyOptional({
    ...defaultExamples.entityId,
    ...defaultExamples.isRequiredForWebapp,
  })
  @Length(26, 26)
  @IsString()
  @IsOptional()
  customInspectionFormId: string;

  @ApiPropertyOptional(defaultExamples.timezoneUtc)
  @RegexMatches([TIMEZONE_REGEX])
  @IsOptional()
  utc: string = '+00:00';
}
