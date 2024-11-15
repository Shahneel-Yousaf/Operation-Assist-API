import { EventType, ISOLocaleCode, UserCurrentStatus } from '@shared/constants';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('user_histories')
export class UserHistory extends BaseEntity {
  @PrimaryColumn({ name: 'user_history_id' })
  userHistoryId: string;

  @Column({ name: 'event_type' })
  eventType: EventType;

  @Column({ name: 'event_at' })
  eventAt: Date;

  @Column({ name: 'actioned_by_user_id' })
  actionedByUserId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'given_name' })
  givenName: string;

  @Column({ name: 'surname' })
  surname: string;

  @Column({ name: 'picture_url' })
  pictureUrl: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'current_status' })
  currentStatus: UserCurrentStatus;

  @ManyToOne(() => User, (user) => user.userHistories)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
