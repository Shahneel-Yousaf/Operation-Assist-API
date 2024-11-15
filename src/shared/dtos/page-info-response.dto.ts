import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PageInfoResponse {
  @ApiPropertyOptional()
  @Expose()
  nextPage?: boolean;

  @ApiPropertyOptional()
  @Expose()
  limit?: number;

  @ApiPropertyOptional()
  @Expose()
  total?: number;

  @ApiPropertyOptional()
  @Expose()
  page?: number;

  @ApiPropertyOptional()
  @Expose()
  firstRequestTime?: Date;
}
