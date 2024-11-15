import { Group } from '@group/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('user_group_settings')
export class UserGroupSetting extends BaseEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'is_archived' })
  isArchived: boolean;

  @ManyToOne(() => User, (user) => user.userGroupSettings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroupSettings)
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
