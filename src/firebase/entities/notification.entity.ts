import { NotificationContentCode, NotificationStatus } from '@shared/constants';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('notifications')
export class Notification extends BaseEntity {
  @PrimaryColumn({ name: 'notification_id' })
  notificationId: string;

  @Column({ name: 'content_code' })
  contentCode: NotificationContentCode;

  @Column({ name: 'content_data' })
  contentData: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'inspection_id' })
  inspectionId: string;

  @Column({ name: 'machine_report_response_id' })
  machineReportResponseId: string;

  @Column({ name: 'sent_at' })
  sentAt: Date;

  @Column({ name: 'status' })
  status: NotificationStatus;

  @Column({ name: 'error_code' })
  errorCode: string;
}
