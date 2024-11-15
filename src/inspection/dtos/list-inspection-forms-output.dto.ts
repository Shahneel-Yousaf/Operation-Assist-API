import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class ListInspectionFormsOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  customInspectionFormId: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionFormName)
  name: string;
}
