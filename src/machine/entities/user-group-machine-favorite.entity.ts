import { Group } from '@group/entities';
import { User } from '@user/entities';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { Machine } from '.';

@Entity('user_group_machine_favorites')
export class UserGroupMachineFavorite extends BaseEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'group_id' })
  groupId: string;

  @PrimaryColumn({ name: 'machine_id' })
  machineId: string;

  @ManyToOne(() => Group, (group) => group.userGroupMachineFavorites)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => Machine, (machine) => machine.userGroupMachineFavorites)
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;

  @ManyToOne(() => User, (user) => user.userGroupMachineFavorites)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
