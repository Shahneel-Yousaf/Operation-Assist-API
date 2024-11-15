import { MachineTypeInspectionFormTemplate } from '@machine/entities';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { InspectionFormTemplateTranslation, InspectionItemTemplate } from '.';

@Entity('inspection_form_templates')
export class InspectionFormTemplate extends BaseEntity {
  @PrimaryColumn({ name: 'inspection_form_template_id' })
  inspectionFormTemplateId: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(
    () => MachineTypeInspectionFormTemplate,
    (machineTypeInspectionFormTemplate) =>
      machineTypeInspectionFormTemplate.inspectionFormTemplate,
  )
  machineTypeInspectionFormTemplates: MachineTypeInspectionFormTemplate[];

  @OneToMany(
    () => InspectionFormTemplateTranslation,
    (inspectionFormTemplateTranslation) =>
      inspectionFormTemplateTranslation.inspectionFormTemplate,
  )
  inspectionFormTemplateTranslations: InspectionFormTemplateTranslation[];

  @OneToMany(
    () => InspectionItemTemplate,
    (inspectionItemTemplate) => inspectionItemTemplate.inspectionFormTemplate,
  )
  inspectionItemTemplates: InspectionItemTemplate[];
}
