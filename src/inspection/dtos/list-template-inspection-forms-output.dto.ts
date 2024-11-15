import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class ListTemplateInspectionFormsOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  inspectionFormTemplateId: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionFormTemplateTranslationName)
  inspectionFormTemplateName: string;
}
