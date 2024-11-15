import { ISOLocaleCode } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { InspectionItemTemplate } from '.';

@Entity('inspection_item_template_translations')
export class InspectionItemTemplateTranslation extends BaseEntity {
  @PrimaryColumn({ name: 'inspection_item_id' })
  inspectionItemId: string;

  @PrimaryColumn({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'item_name' })
  itemName: string;

  @Column({ name: 'item_description' })
  itemDescription: string;

  @ManyToOne(
    () => InspectionItemTemplate,
    (inspectionItemTemplate) =>
      inspectionItemTemplate.inspectionItemTemplateTranslations,
  )
  @JoinColumn({ name: 'inspection_item_id' })
  inspectionItemTemplate: InspectionItemTemplate;

  @OneToOne(
    () => InspectionItemTemplate,
    (inspectionItemTemplate) =>
      inspectionItemTemplate.inspectionItemTemplateTranslation,
  )
  inspectionItemTemplateIsoLocaleCode: InspectionItemTemplate;
}
