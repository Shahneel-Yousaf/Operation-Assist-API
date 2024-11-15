import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class OperationOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  operationId: string;

  @Expose()
  @ApiProperty()
  operationCode: string;
}
