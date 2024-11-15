import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class GroupPermissionOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  groupId: string;

  @Expose()
  @ApiProperty(defaultExamples.permissions)
  permissions: Record<string, string>;
}
