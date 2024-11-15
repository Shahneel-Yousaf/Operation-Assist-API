import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PageInfoResponse, ScreenPermissionResponse } from '.';

export class BaseMetaResponse {
  @ApiPropertyOptional()
  @Expose()
  successMessage?: string;

  @ApiPropertyOptional()
  @Expose()
  pageInfo?: PageInfoResponse;

  @ApiPropertyOptional()
  @Expose()
  screenPermission?: ScreenPermissionResponse;
}
