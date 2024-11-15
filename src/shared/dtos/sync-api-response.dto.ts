import { ApiProperty } from '@nestjs/swagger';

import { BaseApiErrorObject } from './base-api-response.dto';

export class SyncApiErrorObject extends BaseApiErrorObject {
  @ApiProperty({ type: String })
  public statusName: string;
}

export class SyncApiErrorResponse {
  @ApiProperty({ type: SyncApiErrorObject })
  public error: SyncApiErrorObject;
}
