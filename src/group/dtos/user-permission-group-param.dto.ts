import { ApiProperty } from '@nestjs/swagger';

import { GroupParam } from './group-param.dto';

export class UserPermissionGroupParam extends GroupParam {
  @ApiProperty()
  userId: string;
}
