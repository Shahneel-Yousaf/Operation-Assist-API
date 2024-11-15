import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

import { GroupPermissionOutput } from './group-permission-output.dto';

export class PermissionInGroupOutput extends GroupPermissionOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userId: string;
}
