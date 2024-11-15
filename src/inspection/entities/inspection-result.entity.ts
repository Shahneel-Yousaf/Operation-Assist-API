import { MachineReport } from '@machine-report/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { CustomInspectionItem, Inspection } from '.';

@Entity('inspection_results')
export class InspectionResult extends BaseEntity {
  @PrimaryColumn({ name: 'inspection_result_id' })
  inspectionResultId: string;

  @Column({ name: 'result' })
  result: string;

  @Column({ name: 'inspection_id' })
  inspectionId: string;

  @Column({ name: 'custom_inspection_item_id' })
  customInspectionItemId: string;

  @Column({ name: 'current_status' })
  currentStatus: string;

  @Column({ name: 'last_status_updated_at' })
  lastStatusUpdatedAt: Date;

  @Column({ name: 'item_code' })
  itemCode: string;

  @ManyToOne(() => Inspection, (inspection) => inspection.inspectionResults)
  @JoinColumn({ name: 'inspection_id' })
  inspection: Inspection;

  @ManyToOne(
    () => CustomInspectionItem,
    (customInspectionItem) => customInspectionItem.inspectionResults,
  )
  @JoinColumn({ name: 'custom_inspection_item_id' })
  customInspectionItem: CustomInspectionItem;

  @OneToOne(
    () => MachineReport,
    (machineReport) => machineReport.inspectionResult,
  )
  machineReport: MachineReport;
}
