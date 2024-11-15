import { InspectionFormTemplate } from '@inspection/entities';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { MachineType } from '.';

@Entity('machine_type_inspection_form_templates')
export class MachineTypeInspectionFormTemplate extends BaseEntity {
  @PrimaryColumn({ name: 'machine_type_id' })
  machineTypeId: string;

  @PrimaryColumn({ name: 'inspection_form_template_id' })
  inspectionFormTemplateId: string;

  @ManyToOne(
    () => MachineType,
    (machineType) => machineType.machineTypeInspectionFormTemplates,
  )
  @JoinColumn({ name: 'machine_type_id' })
  machineType: MachineType;

  @ManyToOne(
    () => InspectionFormTemplate,
    (inspectionFormTemplate) =>
      inspectionFormTemplate.machineTypeInspectionFormTemplates,
  )
  @JoinColumn({ name: 'inspection_form_template_id' })
  inspectionFormTemplate: InspectionFormTemplate;
}
