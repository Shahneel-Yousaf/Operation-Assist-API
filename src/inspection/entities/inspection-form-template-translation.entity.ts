import { ISOLocaleCode } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { InspectionFormTemplate } from '.';

@Entity('inspection_form_template_translations')
export class InspectionFormTemplateTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'inspection_form_template_id' })
  inspectionFormTemplateId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'inspection_form_template_name' })
  inspectionFormTemplateName: string;

  @ManyToOne(
    () => InspectionFormTemplate,
    (inspectionFormTemplate) =>
      inspectionFormTemplate.inspectionFormTemplateTranslations,
  )
  @JoinColumn({ name: 'inspection_form_template_id' })
  inspectionFormTemplate: InspectionFormTemplate;
}
