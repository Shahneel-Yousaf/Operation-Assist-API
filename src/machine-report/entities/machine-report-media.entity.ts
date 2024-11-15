import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { MachineReportResponse } from '.';

@Entity('machine_report_medias')
export class MachineReportMedia extends BaseEntity {
  @PrimaryColumn({ name: 'machine_report_media_id' })
  machineReportMediaId: string;

  @Column({ name: 'machine_report_response_id' })
  machineReportResponseId: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'media_url' })
  mediaUrl: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(
    () => MachineReportResponse,
    (machineReportResponse) => machineReportResponse.machineReportMedias,
  )
  @JoinColumn({ name: 'machine_report_response_id' })
  machineReportResponse: MachineReportResponse;
}
