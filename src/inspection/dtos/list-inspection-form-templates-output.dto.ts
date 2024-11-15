import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import {
  ListInspectionFormsOutput,
  ListTemplateInspectionFormsOutput,
} from '.';

export class ListInspectionFormTemplateOutput {
  @ApiProperty({ type: () => ListTemplateInspectionFormsOutput, isArray: true })
  @Expose()
  @Type(() => ListTemplateInspectionFormsOutput)
  inspectionFormTemplates: ListTemplateInspectionFormsOutput[];

  @ApiProperty({ type: () => ListInspectionFormsOutput, isArray: true })
  @Expose()
  @Type(() => ListInspectionFormsOutput)
  customInspectionForms: ListInspectionFormsOutput[];
}
