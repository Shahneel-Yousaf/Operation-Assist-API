import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResourceOutput {
  @Expose()
  @ApiProperty()
  resourceId: string;

  @Expose()
  @ApiProperty()
  resourceCode: string;
}
