import { DeviceCurrentStatus, DevicePlatform } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('devices')
export class Device extends BaseEntity {
  @PrimaryColumn({ name: 'device_id' })
  deviceId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'device_type' })
  deviceType: DevicePlatform;

  @Column({ name: 'fcm_token' })
  fcmToken: string;

  @Column({ name: 'last_active_at' })
  lastActiveAt: Date;

  @Column({ name: 'current_status' })
  currentStatus: DeviceCurrentStatus;

  @Column({ name: 'last_status_updated_at' })
  lastStatusUpdatedAt: Date;

  @ManyToOne(() => User, (user) => user.devices)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
