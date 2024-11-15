import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class CreateInspectionFormOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  customInspectionFormId: string;
}
