import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('user_settings')
export class UserSetting extends BaseEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'report_notification' })
  reportNotification: boolean;

  @Column({ name: 'inspection_notification' })
  inspectionNotification: boolean;

  @Column({ name: 'suppress_data_usage_popup' })
  suppressDataUsagePopup: boolean;

  @OneToOne(() => User, (user) => user.userSetting)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
