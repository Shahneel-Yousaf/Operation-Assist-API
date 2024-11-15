import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { InspectionFormTemplate, InspectionItemTemplateTranslation } from '.';

@Entity('inspection_item_templates')
export class InspectionItemTemplate extends BaseEntity {
  @PrimaryColumn({ name: 'inspection_item_id' })
  inspectionItemId: string;

  @Column({ name: 'result_type' })
  resultType: string;

  @Column({ name: 'inspection_form_template_id' })
  inspectionFormTemplateId: string;

  @Column({ name: 'is_immutable_item' })
  isImmutableItem: boolean;

  @Column({ name: 'is_forced_required_item' })
  isForcedRequiredItem: boolean;

  @Column({ name: 'position' })
  position: number;

  @Column({ name: 'item_code' })
  itemCode: string;

  @ManyToOne(
    () => InspectionFormTemplate,
    (inspectionFormTemplate) => inspectionFormTemplate.inspectionItemTemplates,
  )
  @JoinColumn({ name: 'inspection_form_template_id' })
  inspectionFormTemplate: InspectionFormTemplate;

  @OneToMany(
    () => InspectionItemTemplateTranslation,
    (inspectionItemTemplateTranslation) =>
      inspectionItemTemplateTranslation.inspectionItemTemplate,
  )
  inspectionItemTemplateTranslations: InspectionItemTemplateTranslation[];

  @OneToOne(
    () => InspectionItemTemplateTranslation,
    (inspectionItemTemplateTranslation) =>
      inspectionItemTemplateTranslation.inspectionItemTemplateIsoLocaleCode,
  )
  @JoinColumn({
    name: 'inspection_item_id',
    referencedColumnName: 'inspectionItemId',
  })
  inspectionItemTemplateTranslation: InspectionItemTemplateTranslation;
}
