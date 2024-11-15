import { GroupPermissionOutput } from '@group/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose, Type } from 'class-transformer';

export class UserPermissionsOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userId: string;

  @Expose()
  @ApiProperty({ type: () => [GroupPermissionOutput] })
  @Type(() => GroupPermissionOutput)
  groups: GroupPermissionOutput[];

  @Expose()
  @ApiProperty(defaultExamples.exp)
  exp: number;
}
