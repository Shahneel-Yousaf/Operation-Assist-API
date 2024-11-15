import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class LimitQuery {
  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsOptional()
  limit: number;
}
