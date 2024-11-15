import { Machine } from '@machine/entities';
import { CustomInspectionFormCurrentStatus } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import {
  CustomInspectionFormHistory,
  CustomInspectionItem,
  Inspection,
  InspectionHistory,
} from '.';

@Entity('custom_inspection_forms')
export class CustomInspectionForm extends BaseEntity {
  @PrimaryColumn({ name: 'custom_inspection_form_id' })
  customInspectionFormId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'machine_id' })
  machineId: string;

  @Column({ name: 'current_status' })
  currentStatus: CustomInspectionFormCurrentStatus;

  @Column({ name: 'last_status_updated_at' })
  lastStatusUpdatedAt: Date;

  @ManyToOne(() => Machine, (machine) => machine.customInspectionForms)
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;

  @OneToMany(
    () => CustomInspectionFormHistory,
    (customInspectionFormHistory) =>
      customInspectionFormHistory.customInspectionForm,
  )
  customInspectionFormHistories: CustomInspectionFormHistory[];

  @OneToMany(
    () => CustomInspectionItem,
    (customInspectionItem) => customInspectionItem.customInspectionForm,
  )
  customInspectionItems: CustomInspectionItem[];

  @OneToMany(() => Inspection, (inspection) => inspection.customInspectionForm)
  inspections: Inspection[];

  @OneToMany(
    () => InspectionHistory,
    (inspectionHistory) => inspectionHistory.customInspectionForm,
  )
  inspectionHistories: InspectionHistory[];
}
