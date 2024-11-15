import { ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples, TIMEZONE_REGEX } from '@shared/constants';
import { RegexMatches } from '@shared/validations';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class GetReportFilterCountQuery {
  @ApiPropertyOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional(defaultExamples.timezoneUtc)
  @RegexMatches([TIMEZONE_REGEX])
  @IsOptional()
  utc: string = '+00:00';
}
