import { GroupHistory, GroupInvitation } from '@group/entities';
import {
  CustomInspectionFormHistory,
  CustomInspectionItemHistory,
  InspectionHistory,
  InspectionResultHistory,
} from '@inspection/entities';
import { MachineCondition, UserGroupMachineFavorite } from '@machine/entities';
import {
  MachineReportHistory,
  MachineReportResponse,
  MachineReportUserRead,
} from '@machine-report/entities';
import {
  dateFormat,
  ISOLocaleCode,
  UserCurrentStatus,
} from '@shared/constants';
import * as dayjs from 'dayjs';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Device } from './device.entity';
import { UserCiamLink } from './user-ciam-link.entity';
import { UserGroupAssignment } from './user-group-assignment.entity';
import { UserGroupSetting } from './user-group-setting.entity';
import { UserHistory } from './user-history.entity';
import { UserSetting } from './user-setting.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'search_id' })
  searchId: string;

  @Column({ name: 'given_name' })
  givenName: string;

  @Column({ name: 'surname' })
  surname: string;

  @Column({ name: 'picture_url' })
  pictureUrl: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'is_searchable_by_email' })
  isSearchableByEmail: boolean;

  @Column({ name: 'registered_at' })
  registeredAt: Date;

  @Column({ name: 'iso_locale_code' })
  isoLocaleCode: ISOLocaleCode;

  @Column({ name: 'residence_country_code' })
  residenceCountryCode: string;

  @Column({
    name: 'date_of_birth',
    type: 'date',
    transformer: {
      from: (dbValue) =>
        dbValue ? dayjs(dbValue).format(dateFormat.yearOnlyFormat) : null,
      to: (entityValue) => entityValue,
    },
  })
  dateOfBirth: string;

  @Column({ name: 'current_status' })
  currentStatus: UserCurrentStatus;

  @Column({ name: 'last_status_updated_at' })
  lastStatusUpdatedAt: Date;

  @OneToMany(
    () => UserGroupAssignment,
    (userGroupAssignment) => userGroupAssignment.user,
  )
  userGroupAssignments: UserGroupAssignment[];

  @OneToMany(() => GroupHistory, (groupHistories) => groupHistories.user)
  groupHistories: GroupHistory[];

  @OneToMany(() => UserCiamLink, (userCiamLink) => userCiamLink.user)
  userCiamLinks: UserCiamLink[];

  @OneToMany(() => UserHistory, (userHistory) => userHistory.user)
  userHistories: UserHistory[];

  @OneToMany(
    () => GroupInvitation,
    (groupInvitation) => groupInvitation.userInvitee,
  )
  groupInvitees: GroupInvitation[];

  @OneToMany(
    () => GroupInvitation,
    (groupInvitation) => groupInvitation.userInviter,
  )
  groupInviters: GroupInvitation[];

  @OneToMany(
    () => UserGroupSetting,
    (userGroupSetting) => userGroupSetting.user,
  )
  userGroupSettings: UserGroupSetting[];

  @OneToMany(
    () => UserGroupMachineFavorite,
    (userGroupMachineFavorite) => userGroupMachineFavorite.user,
  )
  userGroupMachineFavorites: UserGroupMachineFavorite[];

  @OneToMany(
    () => MachineCondition,
    (machineCondition) => machineCondition.user,
  )
  machineConditions: MachineCondition[];

  @OneToMany(
    () => MachineReportResponse,
    (MachineReportResponse) => MachineReportResponse.user,
  )
  machineReportResponses: MachineReportResponse[];

  @OneToMany(
    () => MachineReportUserRead,
    (machineReportUserRead) => machineReportUserRead.user,
  )
  machineReportUserReads: MachineReportUserRead[];

  @OneToMany(
    () => MachineReportHistory,
    (machineReportHistory) => machineReportHistory.user,
  )
  machineReportHistories: MachineReportHistory[];

  @OneToMany(
    () => InspectionResultHistory,
    (inspectionResultHistory) => inspectionResultHistory.user,
  )
  inspectionResultHistories: InspectionResultHistory[];

  @OneToMany(
    () => CustomInspectionItemHistory,
    (customInspectionItemHistory) => customInspectionItemHistory.user,
  )
  customInspectionItemHistories: CustomInspectionItemHistory[];

  @OneToMany(
    () => InspectionHistory,
    (inspectionHistory) => inspectionHistory.user,
  )
  inspectionHistories: InspectionHistory[];

  @OneToMany(
    () => CustomInspectionFormHistory,
    (customInspectionFormHistory) => customInspectionFormHistory.user,
  )
  customInspectionFormHistories: CustomInspectionFormHistory[];

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToOne(() => UserSetting, (userSetting) => userSetting.user)
  userSetting: UserSetting;
}
