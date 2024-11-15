import { Machine, UserGroupMachineFavorite } from '@machine/entities';
import { GroupCurrentStatus } from '@shared/constants';
import { UserGroupAssignment, UserGroupSetting } from '@user/entities';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { GroupHistory } from './group-history.entity';

@Entity('groups')
export class Group extends BaseEntity {
  @PrimaryColumn({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'group_name' })
  groupName: string;

  @Column({ name: 'location' })
  location: string;

  @Column({ name: 'current_status' })
  currentStatus: GroupCurrentStatus;

  @Column({ name: 'last_status_updated_at' })
  lastStatusUpdatedAt: Date;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'allow_non_komatsu_info_use' })
  allowNonKomatsuInfoUse: boolean;

  @OneToMany(() => GroupHistory, (groupHistories) => groupHistories.group)
  groupHistories: GroupHistory[];

  @OneToMany(
    () => UserGroupAssignment,
    (userGroupAssignment) => userGroupAssignment.group,
  )
  userGroupAssignments: UserGroupAssignment[];

  @OneToMany(
    () => UserGroupSetting,
    (userGroupSetting) => userGroupSetting.group,
  )
  userGroupSettings: UserGroupSetting[];

  @OneToMany(
    () => UserGroupMachineFavorite,
    (userGroupMachineFavorite) => userGroupMachineFavorite.group,
  )
  userGroupMachineFavorites: UserGroupMachineFavorite[];

  @OneToMany(() => Machine, (machine) => machine.group)
  machines: Machine[];
}
