import { PartType } from '@template/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { FuelMaintenanceReport, PartReplacementMedia } from '.';

@Entity('part_replacements')
export class PartReplacement extends BaseEntity {
  @PrimaryColumn({ name: 'part_replacement_id' })
  partReplacementId: string;

  @Column({ name: 'machine_report_response_id' })
  machineReportResponseId: string;

  @Column({ name: 'part_type_id' })
  partTypeId: string;

  @Column({ name: 'content' })
  content: string;

  @ManyToOne(() => PartType, (partType) => partType.partReplacements)
  @JoinColumn([{ name: 'part_type_id' }])
  partType: PartType;

  @ManyToOne(
    () => FuelMaintenanceReport,
    (fuelMaintenanceReport) => fuelMaintenanceReport.partReplacements,
  )
  @JoinColumn([{ name: 'machine_report_response_id' }])
  fuelMaintenanceReport: FuelMaintenanceReport;

  @OneToMany(
    () => PartReplacementMedia,
    (partReplacementMedia) => partReplacementMedia.partReplacement,
  )
  partReplacementMedias: PartReplacementMedia[];
}
