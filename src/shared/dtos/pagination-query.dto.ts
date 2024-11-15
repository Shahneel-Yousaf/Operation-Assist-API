import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationQuery {
  @ApiPropertyOptional({
    description: 'Optional, limit number of items each page',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit: number;

  @ApiPropertyOptional({
    description: 'Optional, The default page number value is 1',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  page: number = 1;
}
